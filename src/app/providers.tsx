'use client';

import { AppRouterCacheProvider } from '@mui/material-nextjs/v13-appRouter';
import { SessionProvider } from 'next-auth/react';
import { AppContextProvider } from '@/contexts/app';
import { FunctionContextProvider } from '@/contexts/function';
import { UserContextProvider } from '@/contexts/user';
import theme from '@/theme/theme';
import { ThemeProvider } from '@mui/material';

export default function Providers({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <SessionProvider>
      <AppRouterCacheProvider>
        <AppContextProvider>
          <UserContextProvider>
            <FunctionContextProvider>
              <ThemeProvider theme={theme}>{children}</ThemeProvider>
            </FunctionContextProvider>
          </UserContextProvider>
        </AppContextProvider>
      </AppRouterCacheProvider>
    </SessionProvider>
  );
}
