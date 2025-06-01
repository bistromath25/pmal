'use client';

import { useRouter } from 'next/navigation';
import { signin } from '@/actions/user';
import AuthForm from '@/components/AuthForm';

export default function SignInPage() {
  const router = useRouter();

  return (
    <AuthForm
      mode='signin'
      onSubmit={async ({ email, password }) => {
        await signin({ email, password });
        router.push('/');
      }}
    />
  );
}
