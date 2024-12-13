import DashboardLayout from '@/components/layouts/Dashboard';

export default async function Page() {
  return <DashboardLayout children={<h1>Settings</h1>} />;
}
