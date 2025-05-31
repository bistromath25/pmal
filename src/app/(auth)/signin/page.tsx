'use client';

import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { signin } from '@/actions/user';
import AuthForm from '@/components/AuthForm';
import { Box } from '@mui/material';

export default function SignInPage() {
  const router = useRouter();

  return (
    <>
      <AuthForm
        mode='signin'
        onSubmit={async ({ email, password }) => {
          await signin({ email, password });
          router.push('/');
        }}
      />
      <Box textAlign='center' mt={2}>
        <Link href='/signup'>Don't have an account? Sign up</Link>
      </Box>
    </>
  );
}
