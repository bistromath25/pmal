'use client';

import Link from 'next/link';
import { HEADER_HEIGHT } from '@/utils';
import { AppBar, Box, Button, Toolbar, Typography } from '@mui/material';

const navLinks = [
  { label: 'How it works', id: 'how-it-works' },
  { label: 'Features', id: 'features' },
];

export default function Header({ showNav = false }: { showNav?: boolean }) {
  return (
    <Box>
      <AppBar
        position='fixed'
        sx={{
          backgroundColor: 'rgba(10,10,20,0.85)',
          backdropFilter: 'blur(12px)',
          borderBottom: '1px solid rgba(255,255,255,0.06)',
          boxShadow: 'none',
          height: `${HEADER_HEIGHT}px`,
        }}
      >
        <Toolbar sx={{ gap: 2 }}>
          <Typography
            component={Link}
            href='/'
            variant='h5'
            sx={{
              fontWeight: 800,
              color: '#f8fafc',
              textDecoration: 'none',
              letterSpacing: '-0.02em',
            }}
          >
            PMAL
          </Typography>

          {showNav && (
            <Box sx={{ display: { xs: 'none', md: 'flex' }, gap: 0.5, ml: 2 }}>
              {navLinks.map(({ label, id }) => (
                <Button
                  key={id}
                  component={Link}
                  href={`/#${id}`}
                  onClick={(e) => {
                    const el = document.getElementById(id);
                    if (el) {
                      e.preventDefault();
                      el.scrollIntoView({ behavior: 'smooth' });
                    }
                  }}
                  sx={{
                    color: '#94a3b8',
                    fontWeight: 500,
                    fontSize: '0.875rem',
                    '&:hover': {
                      color: '#f8fafc',
                      background: 'rgba(255,255,255,0.06)',
                    },
                  }}
                >
                  {label}
                </Button>
              ))}
            </Box>
          )}

          <Box sx={{ flexGrow: 1 }} />

          <Button
            href='/signin'
            sx={{
              color: '#94a3b8',
              fontWeight: 600,
              '&:hover': {
                color: '#f8fafc',
                background: 'rgba(255,255,255,0.06)',
              },
            }}
          >
            Sign in
          </Button>
          <Button
            href='/signup'
            variant='contained'
            sx={{
              background: '#fff',
              color: '#0a0a14',
              fontWeight: 700,
              '&:hover': { background: '#e2e8f0' },
            }}
          >
            Sign up
          </Button>
        </Toolbar>
      </AppBar>
    </Box>
  );
}
