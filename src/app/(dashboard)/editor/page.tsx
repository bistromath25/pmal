import { redirect } from 'next/navigation';
import EditorPlaygroundWrapper from '@/components/EditorPlayground/EditorPlaygroundWrapper';
import DashboardLayout from '@/components/layouts/Dashboard';
import { APP_BASE_URL } from '@/env/env';
import { auth } from '@/services/auth';

export default async function Page() {
  const session = await auth();
  if (!session?.user) {
    redirect(APP_BASE_URL);
  }
  return (
    <DashboardLayout>
      <EditorPlaygroundWrapper />
    </DashboardLayout>
  );
}
