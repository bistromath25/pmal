'use client';

import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { signout } from '@/actions/user';
import { useApp } from '@/contexts/app';
import { SIDEBAR_COLLAPSE_WIDTH, SIDEBAR_FULL_WIDTH } from '@/utils';
import FormatListBulletedIcon from '@mui/icons-material/FormatListBulleted';
import HomeIcon from '@mui/icons-material/Home';
import LogoutIcon from '@mui/icons-material/Logout';
import { Box, Drawer, Stack, Tooltip, Typography } from '@mui/material';

const sidebarOptions = [
  { name: 'Home', icon: <HomeIcon fontSize='small' />, path: '/home' },
  {
    name: 'Functions',
    icon: <FormatListBulletedIcon fontSize='small' />,
    path: '/functions',
  },
];

export default function Sidebar() {
  const pathname = usePathname();
  const router = useRouter();
  const { sidebarOpen, setSidebarOpen } = useApp();

  const handleSignOut = async () => {
    await signout();
    router.push('/signin');
  };

  return (
    <Box sx={{ display: 'flex' }}>
      <Drawer
        variant='permanent'
        open={sidebarOpen}
        sx={{
          flexShrink: 0,
          '& .MuiDrawer-paper': {
            width: sidebarOpen ? SIDEBAR_FULL_WIDTH : SIDEBAR_COLLAPSE_WIDTH,
            transition: 'width 0.25s ease',
            overflowX: 'hidden',
            whiteSpace: 'nowrap',
            top: 0,
            position: 'sticky',
            height: '100vh',
            background: '#0d1117',
            borderRight: '1px solid rgba(255,255,255,0.06)',
            display: 'flex',
            flexDirection: 'column',
            px: 1.5,
            py: 2,
          },
        }}
      >
        <Stack sx={{ height: '100%' }} justifyContent='space-between'>
          <Stack spacing={0.5}>
            {/* Logo */}
            <Box
              sx={{
                display: 'flex',
                alignItems: 'center',
                gap: 1.5,
                px: 1,
                py: 1,
                mb: 1,
                cursor: 'pointer',
                borderRadius: '8px',
                '&:hover': { background: 'rgba(255,255,255,0.05)' },
              }}
              onClick={() => setSidebarOpen(!sidebarOpen)}
            >
              <img
                src='/favicon.ico'
                width={28}
                height={28}
                style={{ flexShrink: 0 }}
              />
              {sidebarOpen && (
                <Typography
                  variant='h6'
                  sx={{
                    fontWeight: 800,
                    color: '#f8fafc',
                    letterSpacing: '-0.02em',
                    fontSize: '1rem',
                  }}
                >
                  PMAL
                </Typography>
              )}
            </Box>

            {/* Nav items */}
            {sidebarOptions.map(({ name, icon, path }) => {
              const isActive = pathname.startsWith(path);
              return (
                <Tooltip
                  key={name}
                  title={sidebarOpen ? '' : name}
                  placement='right'
                >
                  <Box
                    component={Link}
                    href={path}
                    sx={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: 1.5,
                      px: 1.5,
                      py: 1,
                      borderRadius: '8px',
                      textDecoration: 'none',
                      transition: 'background 0.15s',
                      background: isActive
                        ? 'rgba(255,255,255,0.08)'
                        : 'transparent',
                      color: isActive ? '#f8fafc' : '#64748b',
                      '&:hover': {
                        background: 'rgba(255,255,255,0.06)',
                        color: '#f8fafc',
                      },
                    }}
                  >
                    <Box sx={{ display: 'flex', flexShrink: 0 }}>{icon}</Box>
                    {sidebarOpen && (
                      <Typography
                        variant='body2'
                        sx={{
                          fontWeight: isActive ? 600 : 500,
                          color: 'inherit',
                        }}
                      >
                        {name}
                      </Typography>
                    )}
                  </Box>
                </Tooltip>
              );
            })}
          </Stack>

          {/* Sign out */}
          <Tooltip title={sidebarOpen ? '' : 'Sign out'} placement='right'>
            <Box
              onClick={handleSignOut}
              sx={{
                display: 'flex',
                alignItems: 'center',
                gap: 1.5,
                px: 1.5,
                py: 1,
                borderRadius: '8px',
                cursor: 'pointer',
                color: '#64748b',
                transition: 'background 0.15s, color 0.15s',
                '&:hover': {
                  background: 'rgba(239,68,68,0.1)',
                  color: '#f87171',
                },
              }}
            >
              <Box sx={{ display: 'flex', flexShrink: 0 }}>
                <LogoutIcon fontSize='small' />
              </Box>
              {sidebarOpen && (
                <Typography
                  variant='body2'
                  sx={{ fontWeight: 500, color: 'inherit' }}
                >
                  Sign out
                </Typography>
              )}
            </Box>
          </Tooltip>
        </Stack>
      </Drawer>
    </Box>
  );
}
