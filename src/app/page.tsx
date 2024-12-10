'use client';

import Editor from '@/components/Editor';
import Image from 'next/image';

export default function Home() {
  return (
    <div className='w-full items-center justify-items-center min-h-screen p-8 pb-20 gap-16'>
      <div style={{ width: '60%' }}>
        <main className='w-full flex flex-col items-center'>
          <Editor />
        </main>
      </div>
    </div>
  );
}
