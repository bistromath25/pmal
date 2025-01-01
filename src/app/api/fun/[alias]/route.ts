import { auth } from '@/services/auth';
import { getFunctionByAlias } from '@/services/supabase';

export async function GET(req: Request) {
  try {
    const session = await auth();
    if (!session) {
      return new Response(null, { status: 401 });
    }
    const alias = new URL(req.url).pathname.split('/api/fun/')[1];
    const f = await getFunctionByAlias(alias);
    if (!f) {
      return new Response(null, { status: 500 });
    }
    return new Response(JSON.stringify({ fun: f }), { status: 200 });
  } catch (error) {
    return new Response(null, { status: 500 });
  }
}
