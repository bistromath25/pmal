'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import logo from '@/app/favicon.ico';
import { FilePenIcon, HouseIcon, ListIcon, SignoutIcon } from './Icons';

const sidebarOptions = [
  {
    name: 'Home',
    icon: <HouseIcon />,
    path: '/home',
  },
  {
    name: 'Functions',
    icon: <ListIcon />,
    path: '/functions',
  },
  {
    name: 'Sign out',
    icon: <SignoutIcon />,
    path: '/signout',
  },
];

export default function Sidebar() {
  const pathname = usePathname();
  return (
    <div className='h-full bg-[rgb(30_36_51)] p-4 space-y-4'>
      <div className='flex flex-row gap-2'>
        <img src={logo.src} className='m-auto mx-0 w-[30px] h-[30px]' />
        <div className='p-2 font-bold text-2xl text-white'>PMAL</div>
      </div>
      <div className='grid grid-cols-3 lg:flex lg:flex-col gap-2'>
        {sidebarOptions.map(({ name, icon, path }) => {
          const isActive = path === pathname;
          const isEditor = name === 'Editor';
          return (
            <div
              key={`sidebar-option-${name}`}
              className={`${isEditor ? 'hidden' : ''} lg:block`}
            >
              <Link href={path}>
                <div
                  className={`w-full p-2 text-gray-50 rounded-lg ${isActive ? 'bg-[rgb(52_58_71)]' : 'hover:bg-[rgb(52_58_71)] transition duration-200'} flex flex-row items-center space-x-2`}
                >
                  {icon}
                  <h1>{name}</h1>
                </div>
              </Link>
            </div>
          );
        })}
      </div>
    </div>
  );
}
