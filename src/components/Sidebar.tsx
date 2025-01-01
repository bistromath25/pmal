'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { FilePenIcon, HouseIcon, SignoutIcon } from './Icons';

const sidebarOptions = [
  {
    name: 'Home',
    icon: <HouseIcon />,
    path: '/home',
  },
  {
    name: 'Editor',
    icon: <FilePenIcon />,
    path: '/editor',
  },
  {
    name: 'Sign out',
    icon: <SignoutIcon />,
    path: '/api/auth/signout',
  },
];

export default function Sidebar() {
  const pathname = usePathname();
  return (
    <div className='h-full bg-white border-r-2 p-4'>
      <div className='grid grid-cols-2 lg:flex lg:flex-col gap-2'>
        {sidebarOptions.map(({ name, icon, path }) => {
          const isActive = path === pathname;
          const isSignout = name === 'Sign out';
          return (
            <div
              key={`sidebar-option-${name}`}
              className={`${isSignout ? 'hidden' : ''} lg:block`}
            >
              <Link href={path}>
                <div
                  className={`w-full p-2 rounded-lg ${isActive ? 'bg-gray-100' : 'hover:bg-gray-100'} flex flex-row items-center space-x-2`}
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
