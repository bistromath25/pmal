'use client';

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useState,
} from 'react';
import { deleteFunctionById } from '@/actions/functions/delete-function';
import { getFunctionsByUserId } from '@/actions/functions/get-functions';
import { updateFunctionById } from '@/actions/functions/update-function';
import {
  ExecutionEntryRecord,
  FunctionRecord,
  FunctionContextValue,
  FunctionUpdatePayload,
} from '@/types-v2';
import { getAlias, getDefaultFunctionValue } from '@/utils';
import { useApp } from './app';
import { useUser } from './user';

export const FunctionContext = createContext<FunctionContextValue | undefined>(
  undefined
);

export function FunctionContextProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const { wrappedRequest, resetError, setSuccess } = useApp();
  const { user } = useUser();
  const [code, setCode] = useState(getDefaultFunctionValue('js'));
  const [language, setLanguage] = useState('js');
  const [currentFunction, setCurrentFunction] = useState<FunctionRecord | null>(
    null
  );
  const [functions, setFunctions] = useState<FunctionRecord[]>([]);
  const [executionEntries, setExecutionEntries] = useState<
    ExecutionEntryRecord[]
  >([]);

  const refreshFunctions = useCallback(async () => {
    if (!user?.id) {
      return;
    }
    await wrappedRequest(async () => {
      try {
        const funs = await getFunctionsByUserId(user.id);
        if (funs) {
          setFunctions(funs);
        }
      } catch {
        resetError();
      }
    });
  }, [user?.id, wrappedRequest, resetError]);

  const updateFunction = useCallback(
    async (payload: FunctionUpdatePayload) => {
      await wrappedRequest(async () => {
        await updateFunctionById(payload);
        const alias = getAlias(payload.id);
        await refreshFunctions();
        setSuccess(`Updated function ${alias}`);
      });
    },
    [refreshFunctions, setSuccess, wrappedRequest]
  );

  const deleteFunction = useCallback(
    async (id: string) => {
      await wrappedRequest(async () => {
        const alias = getAlias(id);
        await deleteFunctionById(id);
        await refreshFunctions();
        setSuccess(`Deleted function ${alias}`);
      });
    },
    [refreshFunctions, setSuccess, wrappedRequest]
  );

  const getFunctionByAlias = useCallback(
    (alias: string) => {
      return functions.find(({ id }) => getAlias(id) === alias) ?? null;
    },
    [functions]
  );

  useEffect(() => {
    refreshFunctions();
  }, [refreshFunctions]);

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
        executionEntries,
        refreshFunctions,
        getFunctionByAlias,
        updateFunction,
        deleteFunction,
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
