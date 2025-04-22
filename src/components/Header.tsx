import { useEffect, useState } from 'react';
import { AppBar, Box, Button, Toolbar, Typography } from '@mui/material';

export interface HeaderProps {
  type: 'landing' | 'dashboard';
}

export default function Header({ type }: HeaderProps) {
  const isLanding = type === 'landing';
  const [scrollY, setScrollY] = useState(0);
  useEffect(() => {
    const onScroll = () => setScrollY(window.scrollY);
    window.removeEventListener('scroll', onScroll);
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);
  return (
    <Box
      sx={{
        flexGrow: 1,
        backgroundColor: '#000',
      }}
    >
      <AppBar position='fixed' sx={{ backgroundColor: '#000' }}>
        <Toolbar>
          <Typography variant='h5' sx={{ fontWeight: 'bold' }}>
            PMAL
          </Typography>
          <Box sx={{ flexGrow: 1 }} />
          <Button href={isLanding ? '/signin' : '/signout'} variant='contained'>
            {isLanding ? 'Sign in with Google' : 'Sign out'}
          </Button>
        </Toolbar>
      </AppBar>
    </Box>
  );
}
