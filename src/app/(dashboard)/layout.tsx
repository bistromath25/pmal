import DashboardLayout from '@/components/layouts/Dashboard';

export default function layout({ children }: { children: React.ReactNode }) {
  return <DashboardLayout>{children}</DashboardLayout>;
}
