import { createUser, getUserByEmail, updateUser } from '@/utils/supabase';
import { randomString } from '@/utils/utils';

export async function POST(req: Request) {
  try {
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
    const { user } = await req.json();
    await updateUser(user);
    return new Response(JSON.stringify(user), {
      status: 200,
    });
  } catch (error) {
    return new Response(null, { status: 500 });
  }
}
