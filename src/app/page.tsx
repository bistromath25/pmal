'use client';

import Landing from '@/components/Landing';
import useAuthRedirect from '@/hooks/useAuthRedirect';

export default function Home() {
  useAuthRedirect();
  return <Landing />;
}
