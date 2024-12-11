import { getFunctionByAlias } from '@/utils/supabase';
import { executeScript, getFunctionName } from '@/utils/utils';

export async function POST(req: Request) {
  try {
    const url = new URL(req.url);
    const params = new URLSearchParams(url.search);
    const alias = url.pathname.split('/api/')[1];
    var f = await getFunctionByAlias(alias);
    if (f && f.fun) {
      const funName = getFunctionName(f.fun);
      const content =
        f.fun +
        `\n${funName}(${Object.values(Object.fromEntries(params)).map((x) => `'${x}'`)});`;
      const result = await executeScript(content);
      return new Response(JSON.stringify({ result }), { status: 200 });
    }
    return new Response(null, { status: 500 });
  } catch (error) {
    return new Response(null, { status: 500 });
  }
}
