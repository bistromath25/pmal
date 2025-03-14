'use client';

import { createContext, useContext, useEffect, useState } from 'react';
import { useSession } from 'next-auth/react';
import * as API from '@/app/api/api';
import { FunctionCreatePayload } from '@/types/Function';
import { User } from '@/types/User';
import { getDefaultFunctionValue } from '@/utils/functions';

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
    id: '',
    created_at: new Date(),
    email: '',
    aliases: [],
    key: '',
    role: 'STANDARD',
  });
  useEffect(() => {
    const getUser = async () => {
      const email = session.data?.user?.email;
      if (email) {
        let { user } = await API.getUser({ email });
        if (!user) {
          ({ user } = await API.createUser({
            email,
            role: 'STANDARD',
          }));
          const payload: FunctionCreatePayload = {
            code: getDefaultFunctionValue('js'),
            language: 'js',
            anonymous: true,
            created_by: user.id,
            belongs_to: user.id,
          };
          await API.createFunctionWithAlias({
            ...payload,
            alias: user.key,
          });
        }
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
