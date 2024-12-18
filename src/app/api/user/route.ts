import { createUser, getUserByEmail, updateUser } from '@/services/supabase';
import { auth } from '@/utils/auth';
import { randomString } from '@/utils/utils';

export async function POST(req: Request) {
  try {
    const session = await auth();
    if (!session) {
      return new Response(null, {
        status: 401,
      });
    }
    const { email } = await req.json();
    const user = await getUserByEmail(email);
    if (!user) {
      const key = randomString(16);
      await createUser({ email, aliases: [], key });
      return new Response(JSON.stringify({ email, aliases: [] }), {
        status: 201,
      });
    } else {
      return new Response(JSON.stringify(user), {
        status: 200,
      });
    }
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
    const { user } = await req.json();
    await updateUser(user);
    return new Response(JSON.stringify(user), {
      status: 200,
    });
  } catch (error) {
    return new Response(null, { status: 500 });
  }
}
