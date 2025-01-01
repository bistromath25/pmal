'use client';

import { createContext, useContext, useEffect, useState } from 'react';
import { useSession } from 'next-auth/react';
import * as API from '@/app/api/api';
import { User } from '@/types/types';

export const UserContext = createContext<
  | { user: User; setUser: React.Dispatch<React.SetStateAction<User>> }
  | undefined
>(undefined);

export function UserContextProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = useSession();
  const [user, setUser] = useState<User>({
    email: '',
    aliases: [],
    key: '',
  });
  useEffect(() => {
    const getUser = async () => {
      const email = session.data?.user?.email;
      if (email) {
        const { user } = await API.getUser({ email });
        setUser(user);
      }
    };
    if (session && !user.email) {
      getUser();
    }
  }, [session, user]);
  return (
    <UserContext.Provider value={{ user, setUser }}>
      {children}
    </UserContext.Provider>
  );
}

export function useUserContext() {
  const user = useContext(UserContext);
  if (!user) {
    throw new Error('useUserContext must be used within a UserContextProvider');
  }
  return user;
}
