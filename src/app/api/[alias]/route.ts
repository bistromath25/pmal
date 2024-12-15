import {
  getFunctionByAlias,
  updateFunctionCallsOnceByAlias,
} from '@/utils/supabase';
import { getFunction } from '@/utils/utils';

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
      const fun = getFunction(f.fun);
      if (fun) {
        const result = fun(...Object.values(Object.fromEntries(params)));
        await updateFunctionCallsOnceByAlias(alias);
        return new Response(
          JSON.stringify({ result, total_calls: f.total_calls + 1 }),
          { status: 200 }
        );
      }
    }
    return new Response(null, { status: 500 });
  } catch (error) {
    return new Response(null, { status: 500 });
  }
}

export async function POST(req: Request) {
  return GET(req);
}
