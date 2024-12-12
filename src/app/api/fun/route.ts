import { createFunction, updateFunction } from '@/utils/supabase';
import { randomString, validateApiKey } from '@/utils/utils';

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const alias = randomString(5);
    const { apiKey, ...fun } = body;
    const { remaining_calls } = fun;
    if (apiKey && validateApiKey(apiKey) && remaining_calls) {
      await createFunction({ ...fun, alias });
    } else {
      await createFunction({ ...fun, alias, remaining_calls: 10 });
    }
    return new Response(JSON.stringify({ alias, remaining_calls }), { status: 200 });
  } catch (error) {
    return new Response(null, { status: 500 });
  }
}

export async function PATCH(req: Request) {
  try {
    const body = await req.json();
    await updateFunction(body);
    return new Response(JSON.stringify({ alias: body.alias }), { status: 200 });
  } catch (error) {
    return new Response(null, { status: 500 });
  }
}

export async function DELETE(req: Request) {
  try {
    return new Response(JSON.stringify({}), { status: 200 });
  } catch (error) {
    return new Response(null, { status: 500 });
  }
}
