'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useApp } from '@/contexts/app';
import { SIDEBAR_COLLAPSE_WIDTH, SIDEBAR_FULL_WIDTH } from '@/utils';
import FormatListBulletedIcon from '@mui/icons-material/FormatListBulleted';
import HomeIcon from '@mui/icons-material/Home';
import LogoutIcon from '@mui/icons-material/Logout';
import {
  Box,
  Button,
  Drawer,
  IconButton,
  Stack,
  Typography,
} from '@mui/material';

const sidebarOptions = [
  {
    name: 'Home',
    icon: <HomeIcon />,
    path: '/home',
  },
  {
    name: 'Functions',
    icon: <FormatListBulletedIcon />,
    path: '/functions',
  },
  {
    name: 'Sign out',
    icon: <LogoutIcon />,
    path: '/signout',
  },
];

export default function Sidebar() {
  const pathname = usePathname();
  const { sidebarOpen, setSidebarOpen } = useApp();
  return (
    <Box
      sx={{
        display: 'flex',
      }}
    >
      <Drawer
        variant='permanent'
        open={sidebarOpen}
        sx={{
          flexShrink: 0,
          '& .MuiDrawer-paper': {
            width: sidebarOpen ? SIDEBAR_FULL_WIDTH : SIDEBAR_COLLAPSE_WIDTH,
            transition: 'width 0.3s',
            overflowX: 'hidden',
            whiteSpace: 'nowrap',
            top: 0,
            position: 'sticky',
            height: '100vh',
            px: 2,
          },
        }}
      >
        <Stack
          sx={{
            pt: 2,
            flexShrink: 0,
            top: 0,
            position: 'sticky',
            height: '100vh',
          }}
        >
          <Stack spacing={1}>
            <Box
              sx={{
                height: 48,
              }}
            >
              <Box
                sx={{
                  display: 'flex',
                  height: '100%',
                  width: 48,
                  borderRadius: 2,
                  '&:hover': {
                    backgroundColor: 'background.paper',
                  },
                }}
              >
                <IconButton
                  onClick={() => setSidebarOpen(!sidebarOpen)}
                  sx={{
                    justifyContent: 'flex-start',
                    width: '100%',
                    height: '100%',
                    color: 'primary.main',
                    fontSize: 24,
                  }}
                  disabled
                >
                  <img src='/favicon.ico' />
                </IconButton>
                {sidebarOpen && (
                  <Typography variant='h5' sx={{ my: 'auto' }}>
                    PMAL
                  </Typography>
                )}
              </Box>
            </Box>
            {sidebarOptions.map(({ name, icon, path }) => {
              const isActive = path === pathname;
              return (
                <Box
                  key={`sidebar-option-${name}`}
                  sx={{
                    height: 48,
                  }}
                >
                  <Box
                    sx={{
                      display: 'flex',
                      height: '100%',
                      borderRadius: 2,
                      '&:hover': {
                        backgroundColor: 'background.paper',
                      },
                      backgroundColor: isActive
                        ? 'background.default'
                        : 'background.paper',
                    }}
                  >
                    {sidebarOpen ? (
                      <Button
                        component={Link}
                        sx={{
                          justifyContent: 'flex-start',
                          px: 2,
                          height: '100%',
                          color: 'primary.main',
                        }}
                        href={path}
                        startIcon={
                          <Box sx={{ display: 'flex', fontSize: 24 }}>
                            {icon}
                          </Box>
                        }
                        fullWidth
                      >
                        <Typography
                          variant='body1'
                          sx={{
                            textTransform: 'none',
                          }}
                        >
                          {name}
                        </Typography>
                      </Button>
                    ) : (
                      <IconButton
                        component={Link}
                        href={path}
                        sx={{
                          justifyContent: 'center',
                          width: '100%',
                          height: '100%',
                          color: 'primary.main',
                          fontSize: 24,
                        }}
                      >
                        {icon}
                      </IconButton>
                    )}
                  </Box>
                </Box>
              );
            })}
          </Stack>
        </Stack>
      </Drawer>
    </Box>
  );
}
