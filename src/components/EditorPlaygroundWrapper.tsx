'use client';

import { useEffect, useState } from 'react';
import { useSession } from 'next-auth/react';
import EditorPlayground from './EditorPlayground';
import { User } from '@/utils/types';
import { defaultFunctionValues } from '@/utils/utils';
import * as API from '@/app/api/api';
import { APP_BASE_URL } from '@/utils/env';
import { useRouter, useSearchParams } from 'next/navigation';

export default function EditorPlaygroundWrapper() {
  const session = useSession();
  const router = useRouter();
  const searchParams = useSearchParams();
  const [currentCode, setCurrentCode] = useState(defaultFunctionValues['js']);
  const [currentUser, setCurrentUser] = useState<User>({
    email: '',
    aliases: [],
    key: '',
  });
  const getUser = async () => {
    const email = session.data?.user?.email;
    if (email) {
      const user = await API.getUser({ email });
      setCurrentUser(user);
    }
  };
  const getKeyFunction = async (alias: string) => {
    if (alias) {
      const { fun } = await API.getFunction({ alias }, true);
      setCurrentCode(fun);
    }
  };
  useEffect(() => {
    getUser();
  }, [session]);
  useEffect(() => {
    getKeyFunction(currentUser.key);
  }, [currentUser]);
  useEffect(() => {
    if (!searchParams.get('language')) {
      router.push('/editor?language=js');
    }
  }, []);
  return (
    <div className='w-full space-y-10'>
      <div className='justify-items-left pl-4 space-y-4'>
        <h1 className='text-4xl font-bold'>Editor Playground</h1>
        <p className='text-gray-600'>
          This function will always be available at{' '}
          <span className='font-mono text-black'>
            {`${APP_BASE_URL}/api/${currentUser.key}`}
          </span>
        </p>
      </div>
      <EditorPlayground
        code={currentCode}
        setCode={setCurrentCode}
        currentUser={currentUser}
      />
    </div>
  );
}
