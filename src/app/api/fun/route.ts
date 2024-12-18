import {
  createFunction,
  deleteFunctionByAlias,
  updateFunction,
} from '@/services/supabase';
import { auth } from '@/utils/auth';
import { randomString } from '@/utils/utils';

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const alias = randomString(5);
    const { total_calls, anonymous } = body;
    if (anonymous) {
      await createFunction({
        ...body,
        alias,
        remaining_calls: 10,
        total_calls: 0,
        anonymous: true,
      });
    } else {
      await createFunction({
        ...body,
        alias,
        anonymous: false,
      });
    }
    return new Response(JSON.stringify({ alias, total_calls }), {
      status: 200,
    });
  } catch (error) {
    return new Response(null, { status: 500 });
  }
}

export async function PATCH(req: Request) {
  try {
    const session = await auth();
    if (!session) {
      return new Response(null, {
        status: 401,
      });
    }
    const body = await req.json();
    await updateFunction(body);
    return new Response(JSON.stringify({ alias: body.alias }), { status: 200 });
  } catch (error) {
    return new Response(null, { status: 500 });
  }
}

export async function DELETE(req: Request) {
  try {
    const session = await auth();
    if (!session) {
      return new Response(null, {
        status: 401,
      });
    }
    const { alias } = await req.json();
    await deleteFunctionByAlias(alias);
    return new Response(JSON.stringify({}), { status: 200 });
  } catch (error) {
    return new Response(null, { status: 500 });
  }
}
