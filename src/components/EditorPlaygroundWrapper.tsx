'use client';

import { useCallback, useEffect, useState } from 'react';
import { useSession } from 'next-auth/react';
import { useRouter, useSearchParams } from 'next/navigation';
import * as API from '@/app/api/api';
import { APP_BASE_URL } from '@/env/env';
import { User } from '@/types/types';
import EditorPlayground from './EditorPlayground';

export default function EditorPlaygroundWrapper() {
  const session = useSession();
  const router = useRouter();
  const searchParams = useSearchParams();
  const [currentCode, setCurrentCode] = useState('');
  const [currentLanguage, setCurrentLanguage] = useState('js');
  const [currentUser, setCurrentUser] = useState<User>({
    email: '',
    aliases: [],
    key: '',
  });
  const getKeyFunction = useCallback(async (alias: string) => {
    if (alias) {
      const {
        fun: { code },
      } = await API.getFunction({ alias }, true);
      setCurrentCode(code);
    }
  }, []);
  useEffect(() => {
    const getUser = async () => {
      const email = session.data?.user?.email;
      if (email) {
        const { user } = await API.getUser({ email });
        setCurrentUser(user);
      }
    };
    getUser();
  }, [session]);
  useEffect(() => {
    getKeyFunction(currentUser.key);
  }, [currentUser, getKeyFunction]);
  useEffect(() => {
    if (!searchParams.get('language')) {
      router.push('/editor?language=js');
    }
  }, [router, searchParams]);
  return (
    <div className='w-full space-y-10 justify'>
      <div className='justify-items-left pl-4 space-y-4'>
        <h1 className='text-4xl font-bold'>Editor Playground</h1>
        <p className='text-gray-600'>
          This function will always be available at{' '}
          <span className='font-mono text-black'>
            {`${APP_BASE_URL}/api/${currentUser.key}`}
          </span>
        </p>
      </div>
      <div className='pl-4 pr-4'>
        <EditorPlayground
          code={currentCode}
          setCode={setCurrentCode}
          language={currentLanguage}
          setLanguage={setCurrentLanguage}
          currentUser={currentUser}
        />
      </div>
    </div>
  );
}
