import { auth } from '@/services/auth';

export default async function useAuth() {
  const session = await auth();
  if (!session) {
    return {
      authenticated: false,
      response: new Response(null, { status: 401 }),
    };
  }
  return {
    authenticated: true,
    response: new Response(null, { status: 200 }),
  };
}
