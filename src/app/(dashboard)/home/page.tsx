import { redirect } from 'next/navigation';
import HomeWrapper from '@/components/Home/HomeWrapper';
import DashboardLayout from '@/components/layouts/Dashboard';
import { env } from '@/env';
import { auth } from '@/services/auth';

export default async function Page() {
  const session = await auth();
  if (!session?.user) {
    redirect(env.APP_BASE_URL);
  }
  return (
    <DashboardLayout>
      <HomeWrapper />
    </DashboardLayout>
  );
}
