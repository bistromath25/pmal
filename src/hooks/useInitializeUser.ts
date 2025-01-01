import { useCallback, useEffect } from 'react';
import { useSession } from 'next-auth/react';
import * as API from '@/app/api/api';
import { getDefaultFunctionValue } from '@/utils/functions';

export default function useInitializeUser() {
  const session = useSession();
  const handleSignin = useCallback(async () => {
    if (session.status === 'authenticated' && session.data.user?.email) {
      try {
        const {
          user: { key },
        } = await API.getUser({ email: session.data.user.email });
        const { fun } = await API.getFunction({ alias: key });
        if (!fun) {
          await API.createFunction({
            code: getDefaultFunctionValue('js'),
            remaining_calls: 10,
            total_calls: 0,
            alias: key,
          });
        }
      } catch {}
    }
  }, [session]);
  useEffect(() => {
    handleSignin();
  }, [handleSignin]);
}
