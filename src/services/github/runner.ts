import JSZip from 'jszip';
import { env } from '@/env';
import { getFunctionName } from '@/utils';
import {
  getFiles,
  getWorkflowRunById,
  getWorkflowRunLogsById,
  getWorkflows,
  updateIndexFile,
} from './api';

export async function runFunction({
  alias,
  code,
  language,
  params,
}: {
  alias: string;
  code: string;
  language: string;
  params: URLSearchParams;
}): Promise<string> {
  const funName = getFunctionName(code, language);
  const inputString = Object.values(Object.fromEntries(params))
    .map((x) => `'${x}'`)
    .join(',');

  const contents = `${code}\nconsole.log(${funName}(${inputString}));`;

  const filesResponse = await getFiles('/js');
  const files = await filesResponse.json();
  const sha =
    files.find(({ name }: { name: string }) => name === env.GITHUB_JS_INDEX)
      ?.sha ?? '';
  const commitMessage = `${alias}-${sha}`;

  await updateIndexFile({
    decodedContents: contents,
    sha,
    language,
    commitMessage,
  });

  const workflowId = await findWorkflowId(commitMessage);
  await waitForWorkflowCompletion(workflowId);
  const logsZip = await getWorkflowLogs(workflowId);

  const rawLog =
    await logsZip.files[env.GITHUB_ACTIONS_JS_STEP].async('string');
  const cleanedLog = rawLog
    .split('\n')
    .filter((line) => line.trim())
    .map((line) => line.split(' ').slice(1).join(' '))
    .join('\n');

  return cleanedLog.split('##[endgroup]\n')[1].trim();
}

async function findWorkflowId(commitMessage: string): Promise<number> {
  const POLL_INTERVAL = 100;
  const POLL_ATTEMPTS = 10;
  let attempts = 0;

  return new Promise((resolve, reject) => {
    async function poll() {
      try {
        const response = await getWorkflows();
        const { workflow_runs } = await response.json();
        const run = workflow_runs.find(
          (workflow: { head_commit: { message: string } }) =>
            workflow.head_commit.message === commitMessage
        );
        if (run?.id) return resolve(run.id);

        if (++attempts >= POLL_ATTEMPTS) {
          return reject(new Error('Unable to find workflow id'));
        }
        setTimeout(poll, POLL_INTERVAL);
      } catch (err) {
        reject(err);
      }
    }
    poll();
  });
}

async function waitForWorkflowCompletion(id: number): Promise<void> {
  const POLL_INTERVAL = 100;
  const POLL_ATTEMPTS = 20;
  let attempts = 0;

  return new Promise((resolve, reject) => {
    async function poll() {
      try {
        const response = await getWorkflowRunById(id);
        const { status } = await response.json();
        if (status === 'completed') return resolve();

        if (++attempts >= POLL_ATTEMPTS) {
          return reject(new Error('Workflow did not complete in time'));
        }
        setTimeout(poll, POLL_INTERVAL);
      } catch (err) {
        reject(err);
      }
    }
    poll();
  });
}

async function getWorkflowLogs(id: number): Promise<JSZip> {
  const response = await getWorkflowRunLogsById(id);
  const buffer = await response.arrayBuffer();
  return JSZip.loadAsync(buffer);
}
