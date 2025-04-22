'use client';

import { useCallback, useEffect } from 'react';
import * as API from '@/app/api/api';
import { useApp } from '@/contexts/app';
import { useFunction } from '@/contexts/function';
import { useUser } from '@/contexts/user';
import useWrappedRequest from '@/hooks/useWrappedRequest';
import { getDefaultFunctionValue } from '@/utils/functions';
import FunctionCharts from './Charts';
import FunctionStats from './Stats';
import { CircularProgress, Stack, Typography } from '@mui/material';

export default function HomeWrapper() {
  const { user: currentUser } = useUser();
  const {
    setCode: setCurrentCode,
    language: currentLanguage,
    setFunctions,
  } = useFunction();
  const { loading } = useApp();
  const { wrappedRequest } = useWrappedRequest();
  const refreshFunctions = useCallback(async () => {
    const { aliases } = currentUser;
    const { funs } = await wrappedRequest(() => API.getFunctions({ aliases }));
    setFunctions(funs);
  }, [currentUser, setFunctions, wrappedRequest]);
  useEffect(() => {
    setCurrentCode(getDefaultFunctionValue(currentLanguage));
  }, [currentLanguage, setCurrentCode]);
  useEffect(() => {
    refreshFunctions();
  }, [refreshFunctions]);
  return (
    <Stack spacing={2}>
      <Typography variant='h4' sx={{ fontWeight: 'bold' }}>
        Home
      </Typography>
      {loading ? (
        <CircularProgress />
      ) : (
        <>
          <FunctionStats />
          <FunctionCharts />
        </>
      )}
    </Stack>
  );
}
