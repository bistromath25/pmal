import { createFunction, updateFunction } from '@/utils/supabase';
import { randomString } from '@/utils/utils';

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const alias = randomString(5);
    await createFunction({ ...body, alias });
    return new Response(JSON.stringify({ alias }), { status: 200 });
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
