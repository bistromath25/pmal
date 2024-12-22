import { auth } from '@/services/auth';
import { getFunctionsByAliases } from '@/services/supabase';

export async function POST(req: Request) {
  try {
    const session = await auth();
    if (!session) {
      return new Response(null, {
        status: 401,
      });
    }
    const { aliases } = await req.json();
    const functions = await getFunctionsByAliases(aliases);
    return new Response(JSON.stringify({ funs: functions }), { status: 200 });
  } catch (error) {
    return new Response(null, { status: 500 });
  }
}
