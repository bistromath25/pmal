'use client';

import Head from 'next/head';
import Sidebar from '@/components/Sidebar';
import { Box, Grid } from '@mui/material';

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <>
      <Head>
        <meta name='viewport' content='width=device-width, initial-scale=1.0' />
      </Head>
      <Box sx={{ display: 'flex', height: '100vh' }}>
        <Box
          sx={{
            width: 'min(250px, 20%)',
            flexShrink: 0,
            backgroundColor: 'rgb(242_245_249)',
          }}
        >
          <Sidebar />
        </Box>
        <Box sx={{ flexGrow: 1 }}>
          <Box sx={{ p: 2, height: '100%' }}>{children}</Box>
        </Box>
      </Box>
    </>
  );
}
