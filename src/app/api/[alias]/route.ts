import JSZip from 'jszip';
import { env } from '@/env';
import * as GH from '@/services/gh';
import {
  createExecutionEntry,
  deleteFunctionByAlias,
  getFunctionByAlias,
  updateFunctionCallsOnceByAlias,
} from '@/services/supabase';
import { ExecutionEntryCreatePayload, FunctionRecord } from '@/types';
import { getFunction, getFunctionName } from '@/utils';

export async function GET(req: Request) {
  try {
    const url = new URL(req.url);
    const params = new URLSearchParams(url.search);
    const alias = url.pathname.split('/api/')[1];
    const f = await getFunctionByAlias(alias);
    if (!f) {
      return new Response(
        JSON.stringify({
          error: 'Function does not exist',
        }),
        { status: 500 }
      );
    }
    const { code, anonymous, total_calls, language } = f;
    if (anonymous && total_calls >= 10) {
      await deleteFunctionByAlias(alias);
      return new Response(
        JSON.stringify({
          error: 'Maximum calls exceeded',
        }),
        { status: 500 }
      );
    }

    let result;
    let newFun: FunctionRecord | null = null;
    const startDate = new Date();
    if (code) {
      if (env.FF_USE_GITHUB_ACTIONS) {
        const funName = getFunctionName(code, language);
        const contents =
          code +
          `\nconsole.log(${funName}(${Object.values(Object.fromEntries(params)).map((x) => `'${x}'`)}));`;

        let response = await GH.getFiles('/js');
        const files = await response.json();
        const sha =
          files.find(
            ({ name }: { name: string }) => name === env.GITHUB_JS_INDEX
          )?.sha ?? '';

        const commitMessage = `${alias}-${sha}`;
        response = await GH.updateIndexFile({
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
          const POLL_INTERVAL = 100;
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
            await zip.files[env.GITHUB_ACTIONS_JS_STEP].async('string');
          const cleanLogContent = dirtyLogContent
            .split('\n')
            .filter((line) => line.trim())
            .map((line) => line.split(' ').slice(1).join(' '))
            .join('\n');

          result = cleanLogContent.split('##[endgroup]\n')[1].trim();
          newFun = await updateFunctionCallsOnceByAlias(alias);
        } catch (error) {
          return new Response(
            JSON.stringify({
              error: 'Execution timed out',
            }),
            { status: 500 }
          );
        }
      } else {
        const fun = getFunction(code);
        if (fun) {
          result = fun(...Object.values(Object.fromEntries(params)));
          newFun = await updateFunctionCallsOnceByAlias(alias);
        }
      }

      if (!newFun) {
        return new Response(
          JSON.stringify({
            error: 'Unable to update function after execution',
          }),
          { status: 500 }
        );
      }

      const endDate = new Date();
      const executionEntry: ExecutionEntryCreatePayload = {
        created_at: startDate,
        updated_at: null,
        deleted_at: null,
        user_id: f.anonymous ? 'anonymous' : f.created_by,
        function_id: f.id,
        function_alias: f.alias,
        code: f.code,
        language: f.language,
        query: params.toString(),
        started_at: startDate,
        ended_at: endDate,
        time: endDate.getTime() - startDate.getTime(),
        result,
      };
      await createExecutionEntry(executionEntry);
      return new Response(
        JSON.stringify({
          result,
          total_calls: newFun.total_calls,
        }),
        { status: 200 }
      );
    }
    return new Response(
      JSON.stringify({
        error: 'Function is empty',
      }),
      { status: 500 }
    );
  } catch (error) {
    return new Response(
      JSON.stringify({
        error: 'Error',
      }),
      { status: 500 }
    );
  }
}

export async function POST(req: Request) {
  return GET(req);
}
