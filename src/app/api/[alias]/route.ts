import JSZip from 'jszip';
import { NextRequest, NextResponse } from 'next/server';
import { serviceRoleCreateExecutionEntry } from '@/actions/execution-entries/create-execution-entry';
import {
  serviceRoleGetFunctionByAlias,
  serviceRoleUpdateFunctionTotalCalls,
} from '@/actions/functions';
import { env } from '@/env';
import * as GitHub from '@/services/github';
import { getFunction, getFunctionName, logError } from '@/utils';

export async function GET(req: NextRequest) {
  try {
    const params = req.nextUrl.searchParams;
    const alias = req.nextUrl.pathname.split('/api/')[1];
    const fun = await serviceRoleGetFunctionByAlias(alias);
    if (!fun) {
      return NextResponse.json(
        { error: 'Function does not exist' },
        { status: 404 }
      );
    }

    const { code, language, total_calls } = fun;

    let result;
    const startDate = new Date();
    if (code) {
      if (env.FF_USE_GITHUB_ACTIONS === 'true') {
        logError('FF_USE_GITHUB_ACTIONS not supported');
        const funName = getFunctionName(code, language);
        const contents =
          code +
          `\nconsole.log(${funName}(${Object.values(Object.fromEntries(params)).map((x) => `'${x}'`)}));`;

        let response = await GitHub.getFiles('/js');
        const files = await response.json();
        const sha =
          files.find(
            ({ name }: { name: string }) => name === env.GITHUB_JS_INDEX
          )?.sha ?? '';

        const commitMessage = `${alias}-${sha}`;
        response = await GitHub.updateIndexFile({
          decodedContents: contents,
          sha,
          language: 'js',
          commitMessage,
        });

        async function findWorkflowId(commitMessage: string): Promise<number> {
          const POLL_INTERVAL = 100;
          const POLL_ATTEMPTS = 10;
          let attempts = 0;
          return new Promise(async (resolve, reject) => {
            async function pollForId() {
              try {
                attempts++;
                const response = await GitHub.getWorkflows();
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
          const POLL_INTERVAL = 100;
          const POLL_ATTEMPTS = 20;
          let attempts = 0;
          return new Promise(async (resolve, reject) => {
            async function pollForCompletion() {
              try {
                attempts++;
                const response = await GitHub.getWorkflowRunById(id);
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
          const response = await GitHub.getWorkflowRunLogsById(id);
          const data = await response.arrayBuffer();
          const zip = await JSZip.loadAsync(data);
          return zip;
        }

        try {
          const id = await findWorkflowId(commitMessage);
          await waitForWorkflowCompletion(id);
          const zip = await getWorkflowLogs(id);

          const dirtyLogContent =
            await zip.files[env.GITHUB_ACTIONS_JS_STEP].async('string');
          const cleanLogContent = dirtyLogContent
            .split('\n')
            .filter((line) => line.trim())
            .map((line) => line.split(' ').slice(1).join(' '))
            .join('\n');

          result = cleanLogContent.split('##[endgroup]\n')[1].trim();
        } catch (error) {
          logError(error);
          return NextResponse.json(
            { error: 'Execution timed out' },
            { status: 500 }
          );
        }
      } else {
        const funCode = getFunction(code);

        if (funCode) {
          result = funCode(...Object.values(Object.fromEntries(params)));
        }
      }

      const endDate = new Date();
      const time = endDate.getTime() - startDate.getTime();

      await serviceRoleUpdateFunctionTotalCalls({
        id: fun.id,
        total_calls: total_calls + 1,
      });

      await serviceRoleCreateExecutionEntry({
        function_id: fun.id,
        user_id: fun.user_id,
        code,
        language,
        query: params.toString(),
        started_at: startDate,
        ended_at: endDate,
        time,
        result,
      });

      return NextResponse.json(
        {
          data: {
            result,
            total_calls: total_calls + 1,
          },
        },
        { status: 200 }
      );
    }

    return NextResponse.json(
      {
        error: 'Function is empty',
      },
      { status: 400 }
    );
  } catch (error) {
    logError(error);
    return NextResponse.json({ error }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  return GET(req);
}
