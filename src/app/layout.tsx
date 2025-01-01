import type { Metadata } from 'next';
import { SessionProvider } from 'next-auth/react';
import { Inter } from 'next/font/google';
import { FunctionContextProvider } from '@/contexts/functionContext';
import { UserContextProvider } from '@/contexts/userContext';
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
    <SessionProvider>
      <UserContextProvider>
        <FunctionContextProvider>
          <html lang='en'>
            <body className={inter.className}>{children}</body>
          </html>
        </FunctionContextProvider>
      </UserContextProvider>
    </SessionProvider>
  );
}
