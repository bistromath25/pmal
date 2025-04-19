'use client';

import { useCallback, useEffect } from 'react';
import * as API from '@/app/api/api';
import { useFunctionContext } from '@/contexts/functionContext';
import { useUserContext } from '@/contexts/userContext';
import { getDefaultFunctionValue } from '@/utils/functions';
import FunctionCharts from './Charts';
import FunctionStats from './Stats';
import { Stack, Typography } from '@mui/material';

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
    <Stack spacing={2}>
      <Typography variant='h4'>Home</Typography>
      <FunctionStats />
      <FunctionCharts />
    </Stack>
  );
}
