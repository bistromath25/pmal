import FunctionTableWrapper from '@/components/FunctionTableWrapper';
import DashboardLayout from '@/components/layouts/Dashboard';

export default async function Page() {
  return <DashboardLayout children={<FunctionTableWrapper />} />;
}
