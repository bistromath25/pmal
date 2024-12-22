import { redirect } from 'next/navigation';
import FunctionTableWrapper from '@/components/FunctionTableWrapper';
import DashboardLayout from '@/components/layouts/Dashboard';
import { auth } from '@/services/auth';
import { APP_BASE_URL } from '@/utils/env';

export default async function Page() {
  const session = await auth();
  if (!session?.user) {
    redirect(APP_BASE_URL);
  }
  return (
    <DashboardLayout>
      <FunctionTableWrapper />
    </DashboardLayout>
  );
}
