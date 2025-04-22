import { auth } from '@/services/auth';
import {
  createFunction,
  deleteFunctionByAlias,
  deleteFunctionById,
  getFunctionByAlias,
  getFunctionById,
  updateFunctionByAlias,
} from '@/services/supabase';
import { Function, FunctionRecord } from '@/types/Function';
import { randomString } from '@/utils/utils';

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
    const alias = params.get('alias');
    const id = params.get('id');
    let fun: Function | null;
    if (alias) {
      fun = await getFunctionByAlias(alias);
    } else if (id) {
      fun = await getFunctionById(id);
    } else {
      return new Response(null, { status: 500 });
    }
    return new Response(JSON.stringify({ fun }), {
      status: 200,
    });
  } catch (error) {
    return new Response(null, { status: 500 });
  }
}

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const alias = randomString(5);
    const { anonymous } = body;
    const record: FunctionRecord = {
      created_at: new Date(),
      updated_at: null,
      deleted_at: null,
      alias,
      ...body,
      total_calls: 0,
      anonymous: !!anonymous,
      frozen: false,
    };
    const newFun = await createFunction(record);
    return new Response(JSON.stringify({ fun: newFun }), {
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
    const newFun = await updateFunctionByAlias(body);
    return new Response(JSON.stringify({ fun: newFun }), { status: 200 });
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
    const { alias, id } = await req.json();
    if (alias) {
      await deleteFunctionByAlias(alias);
    } else if (id) {
      await deleteFunctionById(id);
    } else {
      return new Response(null, { status: 500 });
    }
    return new Response(JSON.stringify({}), { status: 200 });
  } catch (error) {
    return new Response(null, { status: 500 });
  }
}
