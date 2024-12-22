import { auth } from '@/services/auth';
import { createUser, getUserByEmail, updateUser } from '@/services/supabase';
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
      const newUser = await createUser({ email, aliases: [], key });
      return new Response(JSON.stringify({ user: newUser }), {
        status: 201,
      });
    } else {
      return new Response(JSON.stringify({ user }), {
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
    const updatedUser = await updateUser(user);
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
