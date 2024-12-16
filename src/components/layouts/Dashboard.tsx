import Head from 'next/head';
import Sidebar from '@/components/Sidebar';
import Footer from '../Footer';
import Header from '../Header';

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
