'use client';

import { createContext, useContext } from 'react';
import { FunctionContextValue } from '@/types-v2';

export const FunctionContext = createContext<FunctionContextValue | undefined>(
  undefined
);

export function FunctionContextProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <FunctionContext.Provider value={{ dummy: '1' }}>
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
