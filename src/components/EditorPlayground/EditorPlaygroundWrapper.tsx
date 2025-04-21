'use client';

import { useCallback, useEffect } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import * as API from '@/app/api/api';
import { useFunction } from '@/contexts/function';
import { useUser } from '@/contexts/user';
import { APP_BASE_URL } from '@/env/env';
import useWrappedRequest from '@/hooks/useWrappedRequest';
import EditorPlayground from './EditorPlayground';
import { Stack, Typography } from '@mui/material';

export default function EditorPlaygroundWrapper() {
  const router = useRouter();
  const { user: currentUser } = useUser();
  const { setCode: setCurrentCode } = useFunction();
  const { wrappedRequest } = useWrappedRequest();
  const searchParams = useSearchParams();
  const getKeyFunction = useCallback(
    async (alias: string) => {
      if (alias) {
        const {
          fun: { code },
        } = await wrappedRequest(() => API.getFunction({ alias }));
        setCurrentCode(code);
      }
    },
    [setCurrentCode, wrappedRequest]
  );
  useEffect(() => {
    getKeyFunction(currentUser.key);
  }, [currentUser, getKeyFunction]);
  useEffect(() => {
    if (!searchParams.get('language')) {
      router.push('/editor?language=js');
    }
  }, [router, searchParams]);
  return (
    <Stack spacing={2}>
      <Typography variant='h4' sx={{ fontWeight: 'bold' }}>
        Editor Playground
      </Typography>
      <Typography variant='h6'>
        This function will always be available at{' '}
        <span className='font-mono text-black'>
          {`${APP_BASE_URL}/api/${currentUser.key}`}
        </span>
      </Typography>
      <EditorPlayground />
    </Stack>
  );
}
