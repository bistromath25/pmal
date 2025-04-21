import type { Metadata } from 'next';
import { AppRouterCacheProvider } from '@mui/material-nextjs/v13-appRouter';
import { SessionProvider } from 'next-auth/react';
import { Inter } from 'next/font/google';
import { AppContextProvider } from '@/contexts/app';
import { FunctionContextProvider } from '@/contexts/function';
import { UserContextProvider } from '@/contexts/user';
import './globals.css';

const inter = Inter({ subsets: ['latin'] });

export const metadata: Metadata = {
  title: 'PMAL',
  description: 'GitHub Actions Lambda',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang='en'>
      <body className={inter.className}>
        <SessionProvider>
          <AppRouterCacheProvider>
            <AppContextProvider>
              <UserContextProvider>
                <FunctionContextProvider>{children}</FunctionContextProvider>
              </UserContextProvider>
            </AppContextProvider>
          </AppRouterCacheProvider>
        </SessionProvider>
      </body>
    </html>
  );
}
