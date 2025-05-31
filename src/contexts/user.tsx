'use client';

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from 'react';
import { getDbUser, getSessionUser } from '@/actions/user';
import { createClient } from '@/services/supabase/client';
import { UserContextValue, UserRecord } from '@/types-v2';
import { useApp } from './app';

export const UserContext = createContext<UserContextValue | undefined>(
  undefined
);

export function UserContextProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const { wrappedRequest, resetError } = useApp();
  const [user, setUser] = useState<UserRecord | null>(null);
  const supabase = useMemo(() => createClient(), []);

  const refreshUser = useCallback(async () => {
    await wrappedRequest(async () => {
      try {
        const sessionUser = await getSessionUser();
        const id = sessionUser?.data.user?.id;
        if (id) {
          const dbUser = await getDbUser(id);
          setUser(dbUser);
        }
      } catch {
        resetError();
      }
    });
  }, [resetError, wrappedRequest]);

  useEffect(() => {
    refreshUser();

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange(async () => refreshUser());

    return () => subscription.unsubscribe();
  }, [refreshUser, supabase.auth]);

  return (
    <UserContext.Provider value={{ user, refreshUser, ready: !!user }}>
      {children}
    </UserContext.Provider>
  );
}

export function useUser() {
  const context = useContext(UserContext);
  if (!context)
    throw new Error('useUser must be used within UserContextProvider');
  return context;
}
