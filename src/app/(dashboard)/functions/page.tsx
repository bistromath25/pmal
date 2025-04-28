import { redirect } from 'next/navigation';
import FunctionTableWrapper from '@/components/FunctionTable/FunctionTableWrapper';
import DashboardLayout from '@/components/layouts/Dashboard';
import { APP_BASE_URL } from '@/env';
import { auth } from '@/services/auth';

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
