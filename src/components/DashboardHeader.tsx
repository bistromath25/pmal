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
import MenuIcon from '@mui/icons-material/Menu';
import {
  AppBar,
  Box,
  Button,
  IconButton,
  Stack,
  Toolbar,
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
          transition: 'margin-left 0.3s, width 0.3s',
          zIndex: (theme) => theme.zIndex.drawer + 1,
          height: `${HEADER_HEIGHT}px`,
        }}
      >
        <Toolbar sx={{ gap: 2 }}>
          <IconButton
            sx={{
              justifyContent: 'center',
              backgroundColor: 'background.main',
              color: 'background.default',
              '&:hover': {
                backgroundColor: 'primary.default',
              },
              transition: 'transform 0.3s ease-in-out',
            }}
            onClick={() => setSidebarOpen(!sidebarOpen)}
          >
            <MenuIcon
              sx={{
                transform: sidebarOpen ? 'rotate(0deg)' : 'rotate(180deg)',
                transition: 'transform 0.3s ease-in-out',
              }}
            />
          </IconButton>
          <IconButton onClick={() => router.back()} color='inherit'>
            <ArrowBackIcon />
          </IconButton>
          <IconButton onClick={() => router.forward()} color='inherit'>
            <ArrowForwardIcon />
          </IconButton>
          <Box sx={{ flexGrow: 1 }} />
          <Typography variant='h6'>{user?.email}</Typography>
          <Button onClick={handleSignOut} variant='outlined' color='inherit'>
            Sign out
          </Button>
        </Toolbar>
      </AppBar>
      <Toolbar />
    </Stack>
  );
}
