import { useCallback, useEffect } from 'react';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import * as API from '@/app/api/api';
import { getDefaultFunctionValue } from '@/utils/functions';

export default function useAuthRedirect() {
  const session = useSession();
  const router = useRouter();
  const handleSignin = useCallback(async () => {
    if (session.status === 'authenticated' && session.data.user?.email) {
      try {
        const {
          user: { key },
        } = await API.getUser({ email: session.data.user.email });
        await API.createFunction({
          code: getDefaultFunctionValue('js'),
          remaining_calls: 10,
          total_calls: 0,
          alias: key,
        });
        router.push('/home');
      } catch {}
    }
  }, [session, router]);
  useEffect(() => {
    handleSignin();
  }, [handleSignin]);
}
