import { createUser, getUserByEmail, updateUser } from '@/utils/supabase';

export async function POST(req: Request) {
  try {
    const { email } = await req.json();
    const user = await getUserByEmail(email);
    if (!user) {
      await createUser({ email, aliases: [] });
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
