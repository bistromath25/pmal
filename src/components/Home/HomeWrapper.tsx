'use client';

import { useCallback, useEffect } from 'react';
import * as API from '@/app/api/api';
import { useFunctionContext } from '@/contexts/functionContext';
import { useUserContext } from '@/contexts/userContext';
import { getDefaultFunctionValue } from '@/utils/functions';
import FunctionCharts from './Charts';
import FunctionStats from './Stats';

export default function HomeWrapper() {
  const { user: currentUser } = useUserContext();
  const {
    setCode: setCurrentCode,
    language: currentLanguage,
    setFunctions,
  } = useFunctionContext();
  const refreshFunctions = useCallback(async () => {
    const { aliases } = currentUser;
    const { funs } = await API.getFunctions({ aliases });
    setFunctions(funs);
  }, [currentUser, setFunctions]);
  useEffect(() => {
    setCurrentCode(getDefaultFunctionValue(currentLanguage));
  }, [currentLanguage, setCurrentCode]);
  useEffect(() => {
    refreshFunctions();
  }, [refreshFunctions]);
  return (
    <div className='w-full space-y-10'>
      <div className='justify-items-left pl-4 pr-4 space-y-6'>
        <h1 className='text-4xl font-bold'>Home</h1>
        <FunctionStats />
        <FunctionCharts />
      </div>
    </div>
  );
}
