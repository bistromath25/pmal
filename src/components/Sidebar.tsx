'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';

const sidebarOptions = [
  {
    name: 'Home',
    path: '/home',
  },
  // {
  //   name: 'Settings',
  //   path: '/settings',
  // },
  {
    name: 'Editor',
    path: '/editor',
  },
  {
    name: 'Sign out',
    path: '/api/auth/signout',
  },
];

export default function Sidebar() {
  const pathname = usePathname();
  return (
    <div className='h-full bg-white border-r-2 p-4'>
      <div className='flex flex-col gap-2'>
        {sidebarOptions.map(({ name, path }) => {
          const isActive = path === pathname;
          return (
            <div key={`sidebar-option-${name}`}>
              <Link href={path}>
                <div
                  className={`w-full p-2 rounded-lg ${isActive ? 'bg-gray-100' : 'hover:bg-gray-100'} flex flex-row items-center`}
                >
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
