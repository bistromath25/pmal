import { getAllFunctions } from '@/utils/supabase';

export async function POST(req: Request) {
  try {
    const functions = await getAllFunctions();
    return new Response(JSON.stringify({ functions }), { status: 200 });
  } catch (error) {
    return new Response(null, { status: 500 });
  }
}
