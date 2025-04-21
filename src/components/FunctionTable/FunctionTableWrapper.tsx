'use client';

import { useCallback, useEffect, useState } from 'react';
import * as API from '@/app/api/api';
import { useFunctionContext } from '@/contexts/functionContext';
import { useUserContext } from '@/contexts/userContext';
import { Function } from '@/types/Function';
import { getDefaultFunctionValue, isValidFunction } from '@/utils/functions';
import { remove } from '@/utils/utils';
import Editor from '../Editor';
import LanguageSelection from '../LanguageSelection';
import Modal from '../Modal';
import FunctionTable from './FunctionTable';
import { Box, Button, Stack, Typography } from '@mui/material';

export default function FunctionTableWrapper() {
  const { user: currentUser, setUser: setCurrentUser } = useUserContext();
  const {
    code: currentCode,
    setCode: setCurrentCode,
    language: currentLanguage,
    setLanguage: setCurrentLanguage,
    setFunctions,
  } = useFunctionContext();
  const [modalIsOpen, setModalIsOpen] = useState(false);
  const [error, setError] = useState(false);
  const refreshFunctions = useCallback(async () => {
    const { aliases } = currentUser;
    const { funs } = await API.getFunctions({ aliases });
    setFunctions(funs);
  }, [currentUser, setFunctions]);
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
      } = await API.createFunction(payload);
      const { user } = await API.updateUser({
        id: currentUser.id,
        aliases: [...currentUser.aliases, alias],
      });
      setCurrentUser(user);
      setError(false);
      setModalIsOpen(false);
    } else {
      setError(true);
    }
  };
  const handleDeleteFunction = useCallback(
    async (alias: string) => {
      await API.deleteFunction({ alias });
      const { user } = await API.updateUser({
        ...currentUser,
        aliases: remove(currentUser.aliases, alias),
      });
      setCurrentUser(user);
    },
    [currentUser, setCurrentUser]
  );
  const handleUpdateFunction = useCallback(
    async (fun: Function) => {
      await API.updateFunction(fun);
      await refreshFunctions();
    },
    [refreshFunctions]
  );
  useEffect(() => {
    setCurrentCode(getDefaultFunctionValue(currentLanguage));
  }, [currentLanguage, setCurrentCode]);
  useEffect(() => {
    refreshFunctions();
  }, [refreshFunctions]);
  return (
    <Stack spacing={2}>
      <Typography variant='h4' sx={{ fontWeight: 'bold' }}>
        Functions
      </Typography>
      <Box>
        <Button variant='contained' onClick={() => setModalIsOpen(true)}>
          Create
        </Button>
      </Box>
      <FunctionTable
        handleDeleteFunction={handleDeleteFunction}
        handleUpdateFunction={handleUpdateFunction}
      />
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
    </Stack>
  );
}
