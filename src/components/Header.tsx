import Link from 'next/link';
import { HEADER_HEIGHT } from '@/utils';
import { AppBar, Box, Button, Toolbar, Typography } from '@mui/material';

export default function Header() {
  return (
    <Box>
      <AppBar
        position='fixed'
        sx={{ backgroundColor: '#000', height: `${HEADER_HEIGHT}px` }}
      >
        <Toolbar sx={{ gap: 2 }}>
          <Typography
            component={Link}
            href='/'
            variant='h5'
            sx={{ fontWeight: 'bold' }}
          >
            PMAL
          </Typography>
          <Box sx={{ flexGrow: 1 }} />
          <Button href='/signin' variant='contained'>
            Sign in
          </Button>
          <Button href='/signup' variant='outlined'>
            Sign up
          </Button>
        </Toolbar>
      </AppBar>
    </Box>
  );
}
