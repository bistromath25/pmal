'use client';

import { useRouter } from 'next/navigation';
import { signout } from '@/actions/user';
import { useApp } from '@/contexts/app';
import { useUser } from '@/contexts/user';
import {
  HEADER_HEIGHT,
  SIDEBAR_COLLAPSE_WIDTH,
  SIDEBAR_FULL_WIDTH,
} from '@/utils';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import ArrowForwardIcon from '@mui/icons-material/ArrowForward';
import LogoutIcon from '@mui/icons-material/Logout';
import MenuIcon from '@mui/icons-material/Menu';
import {
  AppBar,
  Box,
  IconButton,
  Stack,
  Toolbar,
  Tooltip,
  Typography,
} from '@mui/material';

export default function DashboardHeader() {
  const router = useRouter();
  const { sidebarOpen, setSidebarOpen } = useApp();
  const { user } = useUser();

  const handleSignOut = async () => {
    await signout();
    router.push('/signin');
  };

  return (
    <Stack>
      <AppBar
        sx={{
          marginLeft: sidebarOpen ? SIDEBAR_FULL_WIDTH : SIDEBAR_COLLAPSE_WIDTH,
          width: sidebarOpen
            ? `calc(100% - ${SIDEBAR_FULL_WIDTH}px)`
            : `calc(100% - ${SIDEBAR_COLLAPSE_WIDTH}px)`,
          transition: 'margin-left 0.25s ease, width 0.25s ease',
          zIndex: (theme) => theme.zIndex.drawer + 1,
          height: `${HEADER_HEIGHT}px`,
          background: '#fff',
          borderBottom: '1px solid #e2e8f0',
          boxShadow: 'none',
        }}
      >
        <Toolbar sx={{ gap: 1 }}>
          <Tooltip title={sidebarOpen ? 'Collapse sidebar' : 'Expand sidebar'}>
            <IconButton
              onClick={() => setSidebarOpen(!sidebarOpen)}
              size='small'
              sx={{
                color: '#94a3b8',
                '&:hover': {
                  color: '#0f172a',
                  background: 'rgba(0,0,0,0.05)',
                },
              }}
            >
              <MenuIcon fontSize='small' />
            </IconButton>
          </Tooltip>

          <Tooltip title='Back'>
            <IconButton
              onClick={() => router.back()}
              size='small'
              sx={{
                color: '#94a3b8',
                '&:hover': {
                  color: '#0f172a',
                  background: 'rgba(0,0,0,0.05)',
                },
              }}
            >
              <ArrowBackIcon fontSize='small' />
            </IconButton>
          </Tooltip>

          <Tooltip title='Forward'>
            <IconButton
              onClick={() => router.forward()}
              size='small'
              sx={{
                color: '#94a3b8',
                '&:hover': {
                  color: '#0f172a',
                  background: 'rgba(0,0,0,0.05)',
                },
              }}
            >
              <ArrowForwardIcon fontSize='small' />
            </IconButton>
          </Tooltip>

          <Box sx={{ flexGrow: 1 }} />

          {user?.email && (
            <>
              <Box
                sx={{
                  width: '1px',
                  height: '16px',
                  background: '#e2e8f0',
                  mx: 0.5,
                }}
              />
              <Typography
                variant='body2'
                sx={{
                  color: '#0f172a',
                  fontSize: '0.9rem',
                  fontWeight: 500,
                  maxWidth: 220,
                  overflow: 'hidden',
                  textOverflow: 'ellipsis',
                  whiteSpace: 'nowrap',
                }}
              >
                {user.email}
              </Typography>
            </>
          )}

          <Tooltip title='Sign out'>
            <IconButton
              onClick={handleSignOut}
              size='small'
              sx={{
                color: '#94a3b8',
                '&:hover': {
                  color: '#ef4444',
                  background: 'rgba(239,68,68,0.08)',
                },
              }}
            >
              <LogoutIcon fontSize='small' />
            </IconButton>
          </Tooltip>
        </Toolbar>
      </AppBar>
      <Toolbar />
    </Stack>
  );
}
