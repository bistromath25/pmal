import { permanentRedirect } from 'next/navigation';
import DashboardLayout from '@/components/layouts/Dashboard';
import { auth } from '@/utils/auth';
import { APP_BASE_URL } from '@/utils/env';
import EditorPlaygroundWrapper from '@/components/EditorPlaygroundWrapper';

export default async function Page() {
  const session = await auth();
  if (!session?.user) {
    permanentRedirect(APP_BASE_URL);
  }
  return <DashboardLayout children={<EditorPlaygroundWrapper />} />;
}
