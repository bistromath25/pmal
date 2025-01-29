import { auth } from '@/services/auth';
import {
  getExecutionEntriesByFunctionAlias,
  getExecutionEntriesByFunctionId,
} from '@/services/supabase';
import { ExecutionEntryRecord } from '@/types/ExecutionEntry';

export async function GET(req: Request) {
  try {
    const session = await auth();
    if (!session) {
      return new Response(null, {
        status: 401,
      });
    }
    const url = new URL(req.url);
    const params = new URLSearchParams(url.search);
    const function_id = params.get('function_id');
    const function_alias = params.get('function_alias');
    let entries: ExecutionEntryRecord[] | null;
    if (function_id) {
      entries = await getExecutionEntriesByFunctionId(function_id);
    } else if (function_alias) {
      entries = await getExecutionEntriesByFunctionAlias(function_alias);
    } else {
      return new Response(null, { status: 500 });
    }
    return new Response(JSON.stringify({ entries }), {
      status: 200,
    });
  } catch (error) {
    return new Response(null, { status: 500 });
  }
}
