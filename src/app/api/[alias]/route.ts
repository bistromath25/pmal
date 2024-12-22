import JSZip from 'jszip';
import * as GH from '@/services/gh';
import {
  getFunctionByAlias,
  updateFunctionCallsOnceByAlias,
} from '@/services/supabase';
import {
  FF_USE_GITHUB_ACTIONS,
  GITHUB_ACTIONS_JS_STEP,
  GITHUB_JS_INDEX,
} from '@/utils/env';
import { Function } from '@/utils/types';
import { getFunction, getFunctionName } from '@/utils/utils';

export async function GET(req: Request) {
  try {
    const url = new URL(req.url);
    const params = new URLSearchParams(url.search);
    const alias = url.pathname.split('/api/')[1];
    const f = await getFunctionByAlias(alias);
    if (params.get('code')) {
      return new Response(JSON.stringify({ fun: f }), { status: 200 });
    }

    let result;
    let newFun: Function | null = null;
    if (f?.code) {
      if (FF_USE_GITHUB_ACTIONS) {
        const funName = getFunctionName(f.code);
        const contents =
          f.code +
          `\nconsole.log(${funName}(${Object.values(Object.fromEntries(params)).map((x) => `'${x}'`)}));`;

        let response = await GH.getFiles('/js');
        const files = await response.json();
        const sha =
          files.find(({ name }: { name: string }) => name === GITHUB_JS_INDEX)
            ?.sha ?? '';

        const commitMessage = `${alias}-${sha}`;
        response = await GH.updateIndexFile({
          decodedContents: contents,
          sha,
          language: 'js',
          commitMessage,
        });

        async function findWorkflowId(commitMessage: string): Promise<number> {
          const POLL_INTERVAL = 500;
          const POLL_ATTEMPTS = 10;
          let attempts = 0;
          return new Promise(async (resolve, reject) => {
            async function pollForId() {
              try {
                attempts++;
                const response = await GH.getWorkflows();
                const { workflow_runs } = await response.json();
                const id = workflow_runs.find(
                  (workflow: { head_commit: { message: string } }) =>
                    workflow.head_commit.message === commitMessage
                )?.id;
                if (id) {
                  resolve(id);
                } else if (attempts >= POLL_ATTEMPTS) {
                  reject(new Error('Unable to find workflow id'));
                } else {
                  setTimeout(pollForId, POLL_INTERVAL);
                }
              } catch (error) {
                reject(error);
              }
            }
            pollForId();
          });
        }

        async function waitForWorkflowCompletion(id: number): Promise<void> {
          const POLL_INTERVAL = 500;
          const POLL_ATTEMPTS = 20;
          let attempts = 0;
          return new Promise(async (resolve, reject) => {
            async function pollForCompletion() {
              try {
                attempts++;
                const response = await GH.getWorkflowRunById(id);
                const { status } = await response.json();
                if (status === 'completed') {
                  resolve();
                } else if (attempts >= POLL_ATTEMPTS) {
                  reject(new Error('Unable to wait for workflow completion'));
                } else {
                  setTimeout(pollForCompletion, POLL_INTERVAL);
                }
              } catch (error) {
                reject(error);
              }
            }
            pollForCompletion();
          });
        }

        async function getWorkflowLogs(id: number): Promise<JSZip> {
          const response = await GH.getWorkflowRunLogsById(id);
          const data = await response.arrayBuffer();
          const zip = await JSZip.loadAsync(data);
          return zip;
        }

        try {
          const id = await findWorkflowId(commitMessage);
          await waitForWorkflowCompletion(id);
          const zip = await getWorkflowLogs(id);

          const dirtyLogContent =
            await zip.files[GITHUB_ACTIONS_JS_STEP].async('string');
          const cleanLogContent = dirtyLogContent
            .split('\n')
            .filter((line) => line.trim())
            .map((line) => line.split(' ').slice(1).join(' '))
            .join('\n');

          result = cleanLogContent.split('##[endgroup]\n')[1].trim();
          newFun = await updateFunctionCallsOnceByAlias(alias);
        } catch (error) {
          return new Response(null, { status: 500 });
        }
      } else {
        const fun = getFunction(f.code);
        if (fun) {
          result = fun(...Object.values(Object.fromEntries(params)));
          newFun = await updateFunctionCallsOnceByAlias(alias);
        }
      }

      if (!newFun) {
        return new Response(null, { status: 500 });
      }
      return new Response(
        JSON.stringify({
          result,
          total_calls: newFun.total_calls,
        }),
        { status: 200 }
      );
    }
    return new Response(null, { status: 500 });
  } catch (error) {
    return new Response(null, { status: 500 });
  }
}

export async function POST(req: Request) {
  return GET(req);
}
