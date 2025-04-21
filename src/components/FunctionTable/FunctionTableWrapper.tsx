'use client';

import { useCallback, useEffect, useState } from 'react';
import * as API from '@/app/api/api';
import { useApp } from '@/contexts/app';
import { useFunction } from '@/contexts/function';
import { useUser } from '@/contexts/user';
import useWrappedRequest from '@/hooks/useWrappedRequest';
import { Function } from '@/types/Function';
import { getDefaultFunctionValue, isValidFunction } from '@/utils/functions';
import { remove } from '@/utils/utils';
import Editor from '../Editor';
import LanguageSelection from '../LanguageSelection';
import Modal from '../Modal';
import FunctionTable from './FunctionTable';
import {
  Box,
  Button,
  CircularProgress,
  Stack,
  Typography,
} from '@mui/material';

export default function FunctionTableWrapper() {
  const { user: currentUser, setUser: setCurrentUser } = useUser();
  const {
    code: currentCode,
    setCode: setCurrentCode,
    language: currentLanguage,
    setLanguage: setCurrentLanguage,
    setFunctions,
  } = useFunction();
  const { loading, setSuccess } = useApp();
  const { wrappedRequest } = useWrappedRequest();
  const [modalIsOpen, setModalIsOpen] = useState(false);
  const [error, setError] = useState(false);
  const refreshFunctions = useCallback(async () => {
    const { aliases } = currentUser;
    const { funs } = await wrappedRequest(() => API.getFunctions({ aliases }));
    setFunctions(funs);
  }, [currentUser, setFunctions, wrappedRequest]);
  const onSubmit = async () => {
    if (isValidFunction(currentCode, currentLanguage)) {
      const payload = {
        code: currentCode,
        language: currentLanguage,
        anonymous: false,
        created_by: currentUser.id,
        belongs_to: [currentUser.id],
      };
      const {
        fun: { alias },
      } = await wrappedRequest(() => API.createFunction(payload));
      const { user } = await wrappedRequest(() =>
        API.updateUser({
          id: currentUser.id,
          aliases: [...currentUser.aliases, alias],
        })
      );
      setCurrentUser(user);
      setError(false);
      setModalIsOpen(false);
      setSuccess(`Created function ${alias}`);
    } else {
      setError(true);
    }
  };
  const handleDeleteFunction = useCallback(
    async (alias: string) => {
      await wrappedRequest(() => API.deleteFunction({ alias }));
      const { user } = await wrappedRequest(() =>
        API.updateUser({
          ...currentUser,
          aliases: remove(currentUser.aliases, alias),
        })
      );
      setCurrentUser(user);
      setSuccess(`Deleted function ${alias}`);
    },
    [currentUser, setCurrentUser, setSuccess, wrappedRequest]
  );
  const handleUpdateFunction = useCallback(
    async (fun: Function) => {
      await wrappedRequest(() => API.updateFunction(fun));
      await refreshFunctions();
      setSuccess(`Updated function ${fun.alias}`);
    },
    [refreshFunctions, setSuccess, wrappedRequest]
  );
  useEffect(() => {
    setCurrentCode(getDefaultFunctionValue(currentLanguage));
  }, [currentLanguage, setCurrentCode]);
  useEffect(() => {
    refreshFunctions();
  }, [refreshFunctions]);
  return (
    <>
      <Stack spacing={2}>
        <Typography variant='h4' sx={{ fontWeight: 'bold' }}>
          Functions
        </Typography>
        <Box>
          <Button variant='contained' onClick={() => setModalIsOpen(true)}>
            Create
          </Button>
        </Box>
        {loading ? (
          <CircularProgress />
        ) : (
          <FunctionTable
            handleDeleteFunction={handleDeleteFunction}
            handleUpdateFunction={handleUpdateFunction}
          />
        )}
      </Stack>
      <Modal
        modalIsOpen={modalIsOpen}
        onClose={() => setModalIsOpen(false)}
        title='Create function'
        contents={
          <Stack spacing={2}>
            <LanguageSelection
              type='dashboard'
              currentLanguage={currentLanguage}
              setCurrentLanguage={setCurrentLanguage}
            />
            <Editor
              code={currentCode}
              setCode={setCurrentCode}
              language={currentLanguage}
              style={{ minHeight: '300px' }}
              error={error}
              setError={setError}
            />
            <Box>
              <Button
                variant='contained'
                onClick={onSubmit}
                disabled={error || !currentCode}
              >
                Deploy
              </Button>
            </Box>
          </Stack>
        }
        editor
      />
    </>
  );
}
