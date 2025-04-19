'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import logo from '@/app/favicon.ico';
import { HouseIcon, ListIcon, SignoutIcon } from './Icons';
import { Box, Stack, Typography } from '@mui/material';

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
    <Stack spacing={2}>
      <Box sx={{ display: 'flex', gap: 2 }}>
        <img src={logo.src} className='m-auto mx-0 w-[30px] h-[30px]' />
        <Typography variant='h4'>PMAL</Typography>
      </Box>
      <Stack spacing={2}>
        {sidebarOptions.map(({ name, icon, path }) => {
          const isActive = path === pathname;
          const isEditor = name === 'Editor';
          return (
            <Box key={`sidebar-option-${name}`}>
              <Link href={path}>
                <Box sx={{ display: 'flex', gap: 2 }}>
                  {icon}
                  <Typography variant='h6'>{name}</Typography>
                </Box>
              </Link>
            </Box>
          );
        })}
      </Stack>
    </Stack>
  );
}
