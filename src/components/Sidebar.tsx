'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import logo from '@/app/favicon.ico';
import theme from '@/theme/theme';
import { HouseIcon, ListIcon, SignoutIcon } from './Icons';
import { Box, Button, Stack, Typography } from '@mui/material';

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
    <Stack spacing={0}>
      <Box sx={{ display: 'flex', p: 4, gap: 2 }}>
        <img src={logo.src} className='m-auto mx-0 w-[30px] h-[30px]' />
        <Typography variant='h4' sx={{ color: theme.colors.offwhite }}>
          PMAL
        </Typography>
      </Box>
      <Stack spacing={1}>
        {sidebarOptions.map(({ name, icon, path }) => {
          const isActive = path === pathname;
          return (
            <Box
              key={`sidebar-option-${name}`}
              sx={{
                backgroundColor: theme.colors.darkergrayblue,
              }}
            >
              <Box
                sx={{
                  display: 'flex',
                  mx: 2,
                  borderRadius: 2,
                  '&:hover': {
                    backgroundColor: theme.colors.darkgrayblue,
                  },
                  backgroundColor: isActive
                    ? theme.colors.darkgrayblue
                    : theme.colors.darkergrayblue,
                }}
              >
                <Button
                  component={Link}
                  sx={{ justifyContent: 'flex-start' }}
                  href={path}
                  startIcon={icon}
                  fullWidth
                >
                  <Typography
                    variant='body1'
                    sx={{
                      color: theme.colors.offwhite,
                      textTransform: 'none',
                    }}
                  >
                    {name}
                  </Typography>
                </Button>
              </Box>
            </Box>
          );
        })}
      </Stack>
    </Stack>
  );
}
