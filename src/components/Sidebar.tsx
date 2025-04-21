'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useApp } from '@/contexts/app';
import theme from '@/theme/theme';
import ChevronLeftIcon from '@mui/icons-material/ChevronLeft';
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
            width: sidebarOpen ? 240 : 60,
            transition: 'width 0.3s',
            overflowX: 'hidden',
            whiteSpace: 'nowrap',
            backgroundColor: theme.colors.darkergrayblue,
            top: 0,
            position: 'sticky',
            height: '100vh',
            px: 1,
          },
        }}
      >
        <Stack
          sx={{
            pt: 2,
            flexShrink: 0,
            backgroundColor: theme.colors.darkergrayblue,
            top: 0,
            position: 'sticky',
            height: '100vh',
          }}
        >
          <Stack spacing={1}>
            <Box>
              <IconButton
                sx={{
                  justifyContent: 'center',
                  backgroundColor: theme.colors.offwhite,
                  '&:hover': {
                    backgroundColor: theme.colors.offwhite,
                    color: theme.colors.darkergrayblue,
                  },
                  transition: 'transform 0.3s ease-in-out', // Smooth rotation transition
                }}
                onClick={() => setSidebarOpen(!sidebarOpen)}
              >
                <ChevronLeftIcon
                  sx={{
                    transform: sidebarOpen ? 'rotate(0deg)' : 'rotate(180deg)', // Rotate by 180 degrees when open
                    transition: 'transform 0.3s ease-in-out', // Smooth rotation transition
                  }}
                />
              </IconButton>
            </Box>
            {sidebarOptions.map(({ name, icon, path }) => {
              const isActive = path === pathname;
              return (
                <Box
                  key={`sidebar-option-${name}`}
                  sx={{
                    backgroundColor: theme.colors.darkergrayblue,
                    height: 48,
                  }}
                >
                  <Box
                    sx={{
                      display: 'flex',
                      height: '100%',
                      borderRadius: 2,
                      '&:hover': {
                        backgroundColor: theme.colors.darkgrayblue,
                      },
                      backgroundColor: isActive
                        ? theme.colors.darkgrayblue
                        : theme.colors.darkergrayblue,
                    }}
                  >
                    {sidebarOpen ? (
                      <Button
                        component={Link}
                        sx={{
                          justifyContent: 'flex-start',
                          px: 2,
                          height: '100%',
                          color: theme.colors.offwhite,
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
                          color: theme.colors.offwhite,
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
