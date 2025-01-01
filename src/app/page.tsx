'use client';

import Landing from '@/components/Landing';
import useInitializeUser from '@/hooks/useInitializeUser';

export default function Home() {
  useInitializeUser();
  return <Landing />;
}
