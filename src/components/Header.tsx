import { AppBar, Box, Button, Toolbar, Typography } from '@mui/material';

export interface HeaderProps {
  type: 'landing' | 'dashboard';
}

export default function Header({ type }: HeaderProps) {
  const isLanding = type === 'landing';
  return (
    <Box
      sx={{
        flexGrow: 1,
        backgroundColor: '#000',
      }}
    >
      <AppBar position='fixed' sx={{ backgroundColor: '#000' }}>
        <Toolbar sx={{ gap: 2 }}>
          <Typography variant='h5' sx={{ fontWeight: 'bold' }}>
            PMAL
          </Typography>
          <Box sx={{ flexGrow: 1 }} />
          <Button href={isLanding ? '/signin' : '/signout'} variant='contained'>
            {isLanding ? 'Sign in' : 'Sign out'}
          </Button>
          {isLanding && (
            <Button href='/signup' variant='outlined'>
              Sign up
            </Button>
          )}
        </Toolbar>
      </AppBar>
    </Box>
  );
}
