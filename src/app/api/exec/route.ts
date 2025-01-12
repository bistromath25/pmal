import { auth } from '@/services/auth';
import { getExecutionEntryById } from '@/services/supabase';
import { ExecutionEntry } from '@/types/ExecutionEntry';

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
    const id = params.get('id');
    let entry: ExecutionEntry | null;
    if (id) {
      entry = await getExecutionEntryById(id);
    } else {
      return new Response(null, { status: 500 });
    }
    return new Response(JSON.stringify({ entry }), {
      status: 200,
    });
  } catch (error) {
    return new Response(null, { status: 500 });
  }
}
