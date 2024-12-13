import { getAllFunctions, getFunctionsByAliases } from '@/utils/supabase';

export async function POST(req: Request) {
  try {
    const { aliases } = await req.json();
    const functions = await getFunctionsByAliases(aliases);
    return new Response(JSON.stringify({ functions }), { status: 200 });
  } catch (error) {
    return new Response(null, { status: 500 });
  }
}
