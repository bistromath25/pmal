'use client';

import Head from 'next/head';
import Sidebar from '@/components/Sidebar';

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <>
      <Head>
        <meta name='viewport' content='width=device-width, initial-scale=1.0' />
      </Head>
      <div className='w-full flex flex-col lg:flex-row bg-[rgb(242_245_249)]'>
        <div className='h-screen sticky top-0 basis-[15%]'>
          <Sidebar />
        </div>
        <div className='basis-[85%] pt-4 p-2'>{children}</div>
      </div>
    </>
  );
}
