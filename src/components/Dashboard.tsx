'use client';

import { useEffect, useState } from 'react';
import Head from 'next/head';
import DashboardHeader from '@/components/DashboardHeader';
import Sidebar from '@/components/Sidebar';
import Toast from '@/components/Toast';
import { useApp } from '@/contexts/app';
import { useUser } from '@/contexts/user';
import { Box, CircularProgress, Stack } from '@mui/material';

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const { error, resetError, success, resetSuccess } = useApp();
  const { ready } = useUser();
  const [errorToastOpen, setErrorToastOpen] = useState(!!error);
  const [successToastOpen, setSuccessToastOpen] = useState(!!success);
  const handleCloseErrorToast = () => {
    setErrorToastOpen(false);
    resetError();
  };
  const handleCloseSuccessToast = () => {
    setSuccessToastOpen(false);
    resetSuccess();
  };
  useEffect(() => {
    if (error) {
      setErrorToastOpen(true);
    }
  }, [error]);
  useEffect(() => {
    if (success) {
      setSuccessToastOpen(true);
    }
  }, [success]);
  return (
    <>
      <Head>
        <meta name='viewport' content='width=device-width, initial-scale=1.0' />
      </Head>
      <Box sx={{ display: 'flex' }}>
        <Sidebar />
        <Box
          sx={{
            flexGrow: 1,
            padding: 4,
            height: '100%',
            backgroundColor: 'background.default',
            minHeight: '100vh',
          }}
        >
          {error && (
            <Toast
              open={errorToastOpen}
              onClose={handleCloseErrorToast}
              type='error'
              message={(error as unknown as Error)?.message ?? String(error)}
            />
          )}
          {success && (
            <Toast
              open={successToastOpen}
              onClose={handleCloseSuccessToast}
              type='success'
              message={success}
            />
          )}
          <Stack>
            <DashboardHeader />
            {ready ? children : <CircularProgress />}
          </Stack>
        </Box>
      </Box>
    </>
  );
}
