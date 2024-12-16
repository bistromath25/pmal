import Head from 'next/head';
import Footer from '@/components/Footer';
import Header from '@/components/Header';
import Sidebar from '@/components/Sidebar';

export default async function DashboardLayout({ children }) {
  return (
    <>
      <Head>
        <meta name='viewport' content='width=device-width, initial-scale=1.0' />
      </Head>
      <Header type='dashboard' />
      <div className='w-full flex flex-col lg:flex-row'>
        <div className='h-screen sticky top-0 basis-[15%]'>
          <Sidebar />
        </div>
        <div className='basis-[85%] pt-4'>{children}</div>
      </div>
      <Footer type='dashboard' />
    </>
  );
}
