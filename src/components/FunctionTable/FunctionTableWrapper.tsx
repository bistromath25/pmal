'use client';

import { useState } from 'react';
import { createFunction } from '@/actions/functions/create-function';
import { useApp } from '@/contexts/app';
import { useFunction } from '@/contexts/function';
import { getAlias } from '@/utils';
import Editor from '../Editor';
import LanguageSelection from '../LanguageSelection';
import Modal from '../Modal';
import FunctionTable from './FunctionTable';
import { Box, Button, Stack, Typography } from '@mui/material';

export default function FunctionTableWrapper() {
  const { error: appError, loading, wrappedRequest, setSuccess } = useApp();
  const {
    code: currentCode,
    setCode: setCurrentCode,
    language: currentLanguage,
    setLanguage: setCurrentLanguage,
    refreshFunctions,
  } = useFunction();
  const [modalIsOpen, setModalIsOpen] = useState(false);
  const [editorError, setEditorError] = useState(false);

  const onSubmit = async () => {
    await wrappedRequest(async () => {
      const id = await createFunction({
        language: currentLanguage,
        code: currentCode,
        anonymous: false,
      });
      await refreshFunctions();

      setEditorError(false);
      setModalIsOpen(false);
      const alias = getAlias(id!);
      setSuccess(`Created function ${alias}`);
    });
  };

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
        <FunctionTable />
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
              error={editorError}
              setError={setEditorError}
            />
            <Box>
              <Button
                variant='contained'
                onClick={onSubmit}
                disabled={editorError || loading || !!appError || !currentCode}
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
