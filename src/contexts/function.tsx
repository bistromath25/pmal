'use client';

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useState,
} from 'react';
import { getExecutionEntryByUserId } from '@/actions/execution-entries';
import * as FunctionActions from '@/actions/functions';
import {
  ExecutionEntryRecord,
  FunctionRecord,
  FunctionContextValue,
  FunctionUpdatePayload,
  FunctionCreatePayload,
} from '@/types';
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

  const [totalCount, setTotalCount] = useState(0);
  const [totalPages, setTotalPages] = useState(0);
  const [currentPage, setCurrentPage] = useState(1);

  const [code, setCode] = useState(getDefaultFunctionValue('js'));
  const [language, setLanguage] = useState('js');
  const [currentFunction, setCurrentFunction] = useState<FunctionRecord | null>(
    null
  );
  const [functions, setFunctions] = useState<FunctionRecord[]>([]);
  const [executionEntries, setExecutionEntries] = useState<
    ExecutionEntryRecord[]
  >([]);

  const refreshFunctions = useCallback(
    async (page: number = 1) => {
      if (!user?.id) {
        return;
      }
      await wrappedRequest(async () => {
        try {
          const response = await FunctionActions.getFunctionsByUserId(
            user.id,
            page
          );
          if (response) {
            if (response.data.length) {
              setFunctions(response.data);
            }
            setTotalPages(response.totalPages);
            setTotalCount(response.count);
            setCurrentPage(page);
          }
          const entries = await getExecutionEntryByUserId(user.id);
          if (entries?.length) {
            setExecutionEntries(entries);
          }
        } catch {
          resetError();
        }
      });
    },
    [user?.id, wrappedRequest, resetError]
  );

  const createFunction = useCallback(
    async (payload: FunctionCreatePayload) => {
      await wrappedRequest(async () => {
        const id = await FunctionActions.createFunction(payload);
        const alias = getAlias(id!);
        await FunctionActions.setFunctionAliasById({ id: id!, alias });
        await refreshFunctions();
        setSuccess(`Created function ${alias}`);
      });
    },
    [wrappedRequest, setSuccess, refreshFunctions]
  );

  const updateFunction = useCallback(
    async (payload: FunctionUpdatePayload) => {
      await wrappedRequest(async () => {
        const alias = getAlias(payload.id);
        await FunctionActions.updateFunctionById(payload);
        await refreshFunctions();
        setSuccess(`Updated function ${alias}`);
      });
    },
    [setSuccess, wrappedRequest, refreshFunctions]
  );

  const deleteFunction = useCallback(
    async (id: string) => {
      await wrappedRequest(async () => {
        const alias = getAlias(id);
        await FunctionActions.deleteFunctionById(id);
        await refreshFunctions();
        setSuccess(`Deleted function ${alias}`);
      });
    },
    [setSuccess, wrappedRequest, refreshFunctions]
  );

  const getFunctionByAlias = useCallback(
    (alias: string) => {
      return functions.find(({ alias: a }) => a === alias) ?? null;
    },
    [functions]
  );

  useEffect(() => {
    refreshFunctions(currentPage);
  }, [refreshFunctions, currentPage]);

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
        createFunction,
        updateFunction,
        deleteFunction,
        totalCount,
        totalPages,
        currentPage,
        setCurrentPage,
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
