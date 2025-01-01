import { useEffect, useState } from 'react';
import Link from 'next/link';

export interface HeaderProps {
  type: 'landing' | 'dashboard';
}

export default function Header({ type }: HeaderProps) {
  const isLanding = type === 'landing';
  const [scrollY, setScrollY] = useState(0);
  useEffect(() => {
    const onScroll = () => setScrollY(window.scrollY);
    window.removeEventListener('scroll', onScroll);
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);
  return (
    <div
      className={`w-full p-4 ${isLanding ? 'bg-black sticky top-0 z-50' : 'bg-gray-50 border border-e-0 border-s-0'} transition duration-1000 ${scrollY > 50 ? 'bg-gray-50 border border-gray-300 border-e-0 border-s-0' : ''}`}
    >
      <div className='grid grid-cols-2'>
        <div
          className={`px-2 py-1 font-bold text-2xl transition duration-1000 ${isLanding && scrollY <= 50 ? 'text-white' : 'text-black'}`}
        >
          PMAL
        </div>
        <div className='text-right px-2'>
          <button className='px-4 py-2 rounded-full border border-blue-800 shadow-md bg-blue-600 hover:border-transparent hover:bg-blue-700 text-center text-white'>
            <Link href={isLanding ? '/signin' : '/signout'}>
              {isLanding ? 'Sign in with Google' : 'Sign out'}
            </Link>
          </button>
        </div>
      </div>
    </div>
  );
}
