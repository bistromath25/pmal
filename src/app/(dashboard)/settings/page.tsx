import { permanentRedirect } from 'next/navigation';
import DashboardLayout from '@/components/layouts/Dashboard';
import { auth } from '@/utils/auth';
import { APP_BASE_URL } from '@/utils/env';

export default async function Page() {
  const session = await auth();
  if (!session?.user) {
    permanentRedirect(APP_BASE_URL);
  }
  return (
    <DashboardLayout>
      <h1>Settings</h1>
    </DashboardLayout>
  );
}
