'use client';

import { createContext, useCallback, useContext, useState } from 'react';

export const AppContext = createContext<
  | {
      loading: boolean;
      setLoading: React.Dispatch<React.SetStateAction<boolean>>;
      error: string | null;
      setError: React.Dispatch<React.SetStateAction<string | null>>;
      resetError: () => void;
      success: string | null;
      setSuccess: React.Dispatch<React.SetStateAction<string | null>>;
      resetSuccess: () => void;
      sidebarOpen: boolean;
      setSidebarOpen: React.Dispatch<React.SetStateAction<boolean>>;
    }
  | undefined
>(undefined);

export function AppContextProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const resetError = useCallback(() => setError(null), []);
  const resetSuccess = useCallback(() => setSuccess(null), []);
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
        sidebarOpen,
        setSidebarOpen,
      }}
    >
      {children}
    </AppContext.Provider>
  );
}

export function useApp() {
  const app = useContext(AppContext);
  if (!app) {
    throw new Error('useApp must be used within a AppContextProvider');
  }
  return app;
}
