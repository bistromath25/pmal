'use client';

import { useState } from 'react';
import { useApp } from '@/contexts/app';
import { useFunction } from '@/contexts/function';
import Editor from './Editor';
import FunctionTable from './FunctionTable';
import LanguageSelection from './LanguageSelection';
import Modal from './Modal';
import { Box, Button, Stack, Typography } from '@mui/material';

export default function FunctionTableWrapper() {
  const { error: appError, loading, wrappedRequest } = useApp();
  const {
    code: currentCode,
    setCode: setCurrentCode,
    language: currentLanguage,
    setLanguage: setCurrentLanguage,
    createFunction,
  } = useFunction();
  const [modalIsOpen, setModalIsOpen] = useState(false);
  const [editorError, setEditorError] = useState(false);

  const onSubmit = async () => {
    await wrappedRequest(async () => {
      await createFunction({
        language: currentLanguage,
        code: currentCode,
        anonymous: false,
      });
      setEditorError(false);
      setModalIsOpen(false);
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
          </Stack>
        }
        actions={
          <Button
            variant='contained'
            onClick={onSubmit}
            disabled={editorError || loading || !!appError || !currentCode}
          >
            Deploy
          </Button>
        }
        editor
      />
    </>
  );
}
