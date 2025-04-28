'use client';

import { createContext, useContext, useEffect, useState } from 'react';
import { useSession } from 'next-auth/react';
import * as API from '@/app/api';
import { ExecutionEntry, Function } from '@/types';
import { getDefaultFunctionValue } from '@/utils';
import { useApp } from './app';
import { useUser } from './user';

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
      executionEntries: ExecutionEntry[];
    }
  | undefined
>(undefined);

export function FunctionContextProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const { setLoading, setError } = useApp();
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
  const [executionEntries, setExecutionEntries] = useState<ExecutionEntry[]>(
    []
  );
  const session = useSession();
  const {
    user: { aliases },
  } = useUser();
  useEffect(() => {
    const getFunctions = async () => {
      try {
        setLoading(true);
        const { funs } = await API.getFunctions({ aliases });
        setFunctions(funs);
        let allEntries: ExecutionEntry[] = [];
        for (const fun of funs) {
          const { entries } = await API.getExecutionEntries({
            function_alias: fun.alias,
          });
          if (entries) {
            allEntries = [...allEntries, ...entries];
          }
        }
        setExecutionEntries(allEntries);
      } catch (error) {
        setError(error as string);
      } finally {
        setLoading(false);
      }
    };
    if (session.status === 'authenticated' && !functions.length) {
      getFunctions();
    }
  }, [session.status, aliases, functions.length, setError, setLoading]);
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
        executionEntries,
      }}
    >
      {children}
    </FunctionContext.Provider>
  );
}

export function useFunction() {
  const functionContext = useContext(FunctionContext);
  if (!functionContext) {
    throw new Error(
      'useFunction must be used within a FunctionContextProvider'
    );
  }
  return functionContext;
}
