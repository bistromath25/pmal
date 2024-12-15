import {
  getFunctionByAlias,
  updateFunctionCallsOnceByAlias,
} from '@/utils/supabase';
import { getFunctionName } from '@/utils/utils';
import * as GH from '@/utils/gh';
import JSZip from 'jszip';
import { GITHUB_ACTIONS_JS_STEP, GITHUB_JS_INDEX } from '@/utils/env';

export async function GET(req: Request) {
  try {
    const url = new URL(req.url);
    const params = new URLSearchParams(url.search);
    const alias = url.pathname.split('/api/')[1];
    const f = await getFunctionByAlias(alias);
    if (params.get('fun')) {
      return new Response(JSON.stringify({ ...f }), { status: 200 });
    }
    if (f && f.fun) {
      const funName = getFunctionName(f.fun);
      const contents =
        f.fun +
        `\nconsole.log(${funName}(${Object.values(Object.fromEntries(params)).map((x) => `'${x}'`)}));`;

      var response = await GH.getFiles('/js');
      const files = await response.json();
      const sha =
        files.find(({ name }: { name: string }) => name === GITHUB_JS_INDEX)
          ?.sha ?? '';

      response = await GH.updateIndexFile({
        decodedContents: contents,
        sha,
        language: 'js',
      });
      response = await GH.getWorkflows();
      const { workflow_runs } = await response.json();
      const id = workflow_runs[0].id;

      response = await GH.getWorkflowRunById(id);
      const data = await response.arrayBuffer();
      const zip = await JSZip.loadAsync(data);

      const dirtyLogContent =
        await zip.files[GITHUB_ACTIONS_JS_STEP].async('string');
      const cleanLogContent = dirtyLogContent
        .split('\n')
        .filter((line) => line.trim())
        .map((line) => line.split(' ').slice(1).join(' '))
        .join('\n');

      await updateFunctionCallsOnceByAlias(alias);
      const result = cleanLogContent.split('##[endgroup]\n')[1].trim();

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
