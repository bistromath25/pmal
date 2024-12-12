import { getFunctionByAlias, updateFunctionCallsOnceByAlias } from '@/utils/supabase';
import { getFunction } from '@/utils/utils';

export async function POST(req: Request) {
  try {
    const url = new URL(req.url);
    const params = new URLSearchParams(url.search);
    const alias = url.pathname.split('/api/')[1];
    var f = await getFunctionByAlias(alias);
    if (f && f.fun) {
      const fun = getFunction(f.fun);
      if (fun) {
        const result = fun(...Object.values(Object.fromEntries(params)));
        await updateFunctionCallsOnceByAlias(alias);
        return new Response(JSON.stringify({ result, remaining_calls: f.remaining_calls - 1 }), { status: 200 });
      }
    }
    return new Response(null, { status: 500 });
  } catch (error) {
    return new Response(null, { status: 500 });
  }
}
