'use client';

import { useRouter } from 'next/navigation';
import { signup } from '@/actions/user';
import AuthForm from '@/components/AuthForm';

export default function SignUpPage() {
  const router = useRouter();

  return (
    <AuthForm
      mode='signup'
      onSubmit={async ({ email, password }) => {
        await signup({ email, password });
        router.push('/');
      }}
    />
  );
}
