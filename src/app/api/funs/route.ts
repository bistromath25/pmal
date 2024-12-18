import { getFunctionsByAliases } from '@/services/supabase';
import { auth } from '@/utils/auth';

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
