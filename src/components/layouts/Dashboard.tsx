'use client';

import Head from 'next/head';
import Sidebar from '@/components/Sidebar';
import theme from '@/theme/theme';
import { Box } from '@mui/material';

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
      <Box sx={{ display: 'flex' }}>
        <Box
          sx={{
            width: 'min(250px, 20%)',
            flexShrink: 0,
            backgroundColor: theme.colors.darkergrayblue,
            top: 0,
            position: 'sticky',
            height: '100vh',
          }}
        >
          <Sidebar />
        </Box>
        <Box
          sx={{
            flexGrow: 1,
            padding: 4,
            height: '100%',
            backgroundColor: theme.colors.offwhite,
            minHeight: '100vh',
          }}
        >
          {children}
        </Box>
      </Box>
    </>
  );
}
