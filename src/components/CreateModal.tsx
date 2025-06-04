import { useState } from 'react';
import { useApp } from '@/contexts/app';
import { useFunction } from '@/contexts/function';
import Editor from './Editor';
import LanguageSelection from './LanguageSelection';
import Modal, { ModalProps } from './Modal';
import { Button, Stack } from '@mui/material';

export default function CreateModal({ modalIsOpen, onClose }: ModalProps) {
  const { error: appError, loading } = useApp();
  const {
    code: currentCode,
    setCode: setCurrentCode,
    language: currentLanguage,
    setLanguage: setCurrentLanguage,
    createFunction,
  } = useFunction();
  const [editorError, setEditorError] = useState(false);

  const onSubmit = async () => {
    await createFunction({
      language: currentLanguage,
      code: currentCode,
      anonymous: false,
    });
    setEditorError(false);
    onClose();
  };

  return (
    <Modal
      modalIsOpen={modalIsOpen}
      onClose={onClose}
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
  );
}
