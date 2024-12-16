import JSZip from 'jszip';
import {
  FF_USE_GITHUB_ACTIONS,
  GITHUB_ACTIONS_JS_STEP,
  GITHUB_JS_INDEX,
} from '@/utils/env';
import * as GH from '@/utils/gh';
import {
  getFunctionByAlias,
  updateFunctionCallsOnceByAlias,
} from '@/utils/supabase';
import { getFunction, getFunctionName, sleep } from '@/utils/utils';

export async function GET(req: Request) {
  try {
    const url = new URL(req.url);
    const params = new URLSearchParams(url.search);
    const alias = url.pathname.split('/api/')[1];
    const f = await getFunctionByAlias(alias);
    if (params.get('fun')) {
      return new Response(JSON.stringify({ ...f }), { status: 200 });
    }

    let result;
    if (f && f.fun) {
      if (FF_USE_GITHUB_ACTIONS) {
        const funName = getFunctionName(f.fun);
        const contents =
          f.fun +
          `\nconsole.log(${funName}(${Object.values(Object.fromEntries(params)).map((x) => `'${x}'`)}));`;

        let response = await GH.getFiles('/js');
        const files = await response.json();
        let sha =
          files.find(({ name }: { name: string }) => name === GITHUB_JS_INDEX)
            ?.sha ?? '';

        const commitMessage = `${alias}-${sha}`;
        response = await GH.updateIndexFile({
          decodedContents: contents,
          sha,
          language: 'js',
          commitMessage,
        });

        await sleep(2000); // find a better way to determine if workflow dispatched
        // no delay: same old count and new count
        response = await GH.getWorkflows();
        let { workflow_runs } = await response.json();
        const id =
          workflow_runs.find((workflow) => {
            return workflow.head_commit.message === commitMessage;
          })?.id ?? workflow_runs[0].id;

        response = await GH.getWorkflowRunById(id);
        let { status } = await response.json();
        while (status !== 'completed') {
          await sleep(1000);
          response = await GH.getWorkflowRunById(id);
          ({ status } = await response.json());
          response = await GH.getWorkflows();
        }

        response = await GH.getWorkflowRunLogsById(id);
        const data = await response.arrayBuffer();
        const zip = await JSZip.loadAsync(data);

        const dirtyLogContent =
          await zip.files[GITHUB_ACTIONS_JS_STEP].async('string');
        const cleanLogContent = dirtyLogContent
          .split('\n')
          .filter((line) => line.trim())
          .map((line) => line.split(' ').slice(1).join(' '))
          .join('\n');

        result = cleanLogContent.split('##[endgroup]\n')[1].trim();
        await updateFunctionCallsOnceByAlias(alias);
      } else {
        const fun = getFunction(f.fun);
        if (fun) {
          result = fun(...Object.values(Object.fromEntries(params)));
          await updateFunctionCallsOnceByAlias(alias);
        }
      }
      return new Response(
        JSON.stringify({
          result,
          total_calls: f.total_calls + 1,
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
