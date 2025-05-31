'use client';

import { createContext, useCallback, useContext, useState } from 'react';
import { AppContextValue } from '@/types-v2';
import { WrappedRequest } from '@/types-v2/WrappedRequest';

export const AppContext = createContext<AppContextValue | undefined>(undefined);

export function AppContextProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const [ready, setReady] = useState(true);
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const resetError = useCallback(() => setError(null), []);
  const resetSuccess = useCallback(() => setSuccess(null), []);

  const wrappedRequest: WrappedRequest = useCallback(
    async (promise) => {
      try {
        setLoading(true);
        setReady(false);
        resetError();
        return await promise();
      } catch (error) {
        setError((error as Error).message ?? String(error));
        return null;
      } finally {
        setLoading(false);
        setReady(true);
      }
    },
    [resetError]
  );

  return (
    <AppContext.Provider
      value={{
        loading,
        setLoading,
        error,
        setError,
        resetError,
        success,
        setSuccess,
        resetSuccess,
        ready,
        setReady,
        wrappedRequest,
        sidebarOpen,
        setSidebarOpen,
      }}
    >
      {children}
    </AppContext.Provider>
  );
}

export function useApp(): AppContextValue {
  const app = useContext(AppContext);
  if (!app) {
    throw new Error('useApp must be used within a AppContextProvider');
  }
  return app;
}
