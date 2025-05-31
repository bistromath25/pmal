'use client';

import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { signup } from '@/actions/user';
import AuthForm from '@/components/AuthForm';
import { Box } from '@mui/material';

export default function SignUpPage() {
  const router = useRouter();

  return (
    <>
      <AuthForm
        mode='signup'
        onSubmit={async ({ email, password }) => {
          await signup({ email, password });
          router.push('/');
        }}
      />
      <Box textAlign='center' mt={2}>
        <Link href='/signin'>Already have an account? Sign in</Link>
      </Box>
    </>
  );
}
