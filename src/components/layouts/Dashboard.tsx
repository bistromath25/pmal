import Head from 'next/head';
import Sidebar from '@/components/Sidebar';

export default async function DashboardLayout({ children }) {
  return (
    <>
      <Head>
        <meta name='viewport' content='width=device-width, initial-scale=1.0' />
      </Head>
      <div className='w-full flex flex-col lg:flex-row'>
        <div className='h-screen sticky top-0 basis-[15%]'>
          <Sidebar />
        </div>
        <div className='basis-[85%]'>{children}</div>
      </div>
    </>
  );
}
