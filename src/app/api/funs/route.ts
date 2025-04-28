import { auth } from '@/services/auth';
import { getFunctionsByAliases, getFunctionsByIds } from '@/services/supabase';
import { FunctionRecord } from '@/types';

export async function POST(req: Request) {
  try {
    const session = await auth();
    if (!session) {
      return new Response(null, {
        status: 401,
      });
    }
    const { aliases, ids } = await req.json();
    let functions: FunctionRecord[];
    if (aliases) {
      functions = await getFunctionsByAliases(aliases);
    } else if (ids) {
      functions = await getFunctionsByIds(ids);
    } else {
      return new Response(null, { status: 500 });
    }
    return new Response(JSON.stringify({ funs: functions }), { status: 200 });
  } catch (error) {
    return new Response(null, { status: 500 });
  }
}
