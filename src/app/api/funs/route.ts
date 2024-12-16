import { auth } from '@/utils/auth';
import { getFunctionsByAliases } from '@/utils/supabase';

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
    return new Response(JSON.stringify({ functions }), { status: 200 });
  } catch (error) {
    return new Response(null, { status: 500 });
  }
}
