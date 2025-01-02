'use client';

import { createContext, useContext, useEffect, useState } from 'react';
import { useSession } from 'next-auth/react';
import * as API from '@/app/api/api';
import { Function } from '@/types/Function';
import { getDefaultFunctionValue } from '@/utils/functions';
import { useUserContext } from './userContext';

export const FunctionContext = createContext<
  | {
      code: string;
      setCode: React.Dispatch<React.SetStateAction<string>>;
      language: string;
      setLanguage: React.Dispatch<React.SetStateAction<string>>;
      currentFunction: Function;
      setCurrentFunction: React.Dispatch<React.SetStateAction<Function>>;
      functions: Function[];
      setFunctions: React.Dispatch<React.SetStateAction<Function[]>>;
    }
  | undefined
>(undefined);

export function FunctionContextProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const [code, setCode] = useState(getDefaultFunctionValue('js'));
  const [language, setLanguage] = useState('js');
  const [currentFunction, setCurrentFunction] = useState<Function>({
    id: '',
    created_at: new Date(),
    alias: '',
    code: '',
    total_calls: 0,
    remaining_calls: 0,
    language: '',
  });
  const [functions, setFunctions] = useState<Function[]>([]);
  const session = useSession();
  const {
    user: { aliases },
  } = useUserContext();
  useEffect(() => {
    const getFunctions = async () => {
      const { funs } = await API.getFunctions({ aliases });
      setFunctions(funs);
    };
    if (session.status === 'authenticated' && !functions.length) {
      getFunctions();
    }
  }, [session, aliases, functions.length]);
  return (
    <FunctionContext.Provider
      value={{
        code,
        setCode,
        language,
        setLanguage,
        currentFunction,
        setCurrentFunction,
        functions,
        setFunctions,
      }}
    >
      {children}
    </FunctionContext.Provider>
  );
}

export function useFunctionContext() {
  const functionContext = useContext(FunctionContext);
  if (!functionContext) {
    throw new Error(
      'useFunctionContext must be used within a FunctionContextProvider'
    );
  }
  return functionContext;
}
