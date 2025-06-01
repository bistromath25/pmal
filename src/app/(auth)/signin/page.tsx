'use client';

import { useRouter } from 'next/navigation';
import { signin } from '@/actions/user';
import AuthForm from '@/components/AuthForm';
import { useUser } from '@/contexts/user';

export default function SignInPage() {
  const router = useRouter();
  const { refreshUser } = useUser();

  return (
    <AuthForm
      mode='signin'
      onSubmit={async ({ email, password }) => {
        await signin({ email, password });
        await refreshUser();
        router.push('/');
      }}
    />
  );
}
