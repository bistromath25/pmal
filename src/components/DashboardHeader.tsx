'use client';

import Link from 'next/link';
import { useApp } from '@/contexts/app';
import { useUser } from '@/contexts/user';
import { SIDEBAR_COLLAPSE_WIDTH, SIDEBAR_FULL_WIDTH } from '@/utils';
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
  const { sidebarOpen, setSidebarOpen } = useApp();
  const {
    user: { name, image },
  } = useUser();
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
          <Box sx={{ flexGrow: 1 }} />
          {image && (
            <IconButton sx={{ padding: 0 }}>
              <img
                src={image}
                style={{ height: 48, width: 48, borderRadius: '50%' }}
              />
            </IconButton>
          )}
          <Typography variant='h6'>{name}</Typography>
          <Button
            component={Link}
            href='/signout'
            variant='outlined'
            color='inherit'
          >
            Sign out
          </Button>
        </Toolbar>
      </AppBar>
      <Toolbar />
    </Stack>
  );
}
