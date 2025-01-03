import { auth } from '@/services/auth';
import {
  createUser,
  getUserByEmail,
  getUserById,
  updateUser,
} from '@/services/supabase';
import { UserRecord } from '@/types/User';
import { randomString } from '@/utils/utils';

export async function GET(req: Request) {
  try {
    const session = await auth();
    if (!session?.user) {
      return new Response(null, {
        status: 401,
      });
    }
    const url = new URL(req.url);
    const params = new URLSearchParams(url.search);
    const email = params.get('email');
    const id = params.get('id');
    let user: UserRecord | null;
    if (email) {
      user = await getUserByEmail(email);
    } else if (id) {
      user = await getUserById(id);
    } else {
      return new Response(null, { status: 500 });
    }
    return new Response(JSON.stringify({ user }), { status: 200 });
  } catch (error) {
    return new Response(null, { status: 500 });
  }
}

export async function POST(req: Request) {
  try {
    const session = await auth();
    if (!session?.user) {
      return new Response(null, {
        status: 401,
      });
    }
    const { email, role } = await req.json();
    const key = randomString(16);
    const id = session.user.id ?? crypto.randomUUID();
    const record: UserRecord = {
      id,
      created_at: new Date(),
      updated_at: null,
      deleted_at: null,
      email,
      name: session.user.name ?? null,
      image: session.user.image ?? null,
      aliases: [],
      key,
      role,
    };
    const newUser = await createUser(record);
    return new Response(JSON.stringify({ user: newUser }), {
      status: 201,
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
    const updatedUser = await updateUser(body);
    return new Response(
      JSON.stringify({
        user: updatedUser,
      }),
      {
        status: 200,
      }
    );
  } catch (error) {
    return new Response(null, { status: 500 });
  }
}
