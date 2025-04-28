'use client';

import { useEffect, useState } from 'react';
import { useSearchParams } from 'next/navigation';
import * as API from '@/app/api';
import Editor from '@/components/Editor';
import { DefaultIcon, SuccessIcon } from '@/components/Icons';
import LanguageSelection from '@/components/LanguageSelection';
import { useFunction } from '@/contexts/function';
import { useUser } from '@/contexts/user';
import { env } from '@/env';
import useWrappedRequest from '@/hooks/useWrappedRequest';
import { getDemoQuery, isValidFunction } from '@/utils';
import { Box, Button, Stack, TextField } from '@mui/material';

export default function EditorPlayground() {
  const searchParams = useSearchParams();
  const {
    user: { key },
  } = useUser();
  const { code, setCode, language, setLanguage } = useFunction();
  const { wrappedRequest } = useWrappedRequest();
  const [error, setError] = useState(false);
  const [demoQuery, setDemoQuery] = useState(getDemoQuery(code, 'js'));
  const [copied, setCopied] = useState(false);
  const [loading, setLoading] = useState(false);
  const onSubmit = async () => {
    setLoading(true);
    try {
      if (isValidFunction(code, language)) {
        await wrappedRequest(() => API.updateFunction({ alias: key, code }));
        setDemoQuery(getDemoQuery(code, language));
        setError(false);
      } else {
        setError(true);
      }
    } finally {
      setLoading(false);
    }
  };
  useEffect(() => {
    setLanguage(searchParams.get('language') ?? language);
  }, [searchParams, language, setLanguage]);
  return (
    <Stack spacing={2}>
      <LanguageSelection
        type='playground'
        currentLanguage={language}
        setCurrentLanguage={setLanguage}
      />
      <Editor
        code={code}
        setCode={setCode}
        error={error}
        setError={setError}
        language={language}
        style={{ backgroundColor: 'white' }}
      />
      <Box>
        <Button onClick={onSubmit} disabled={error || !code}>
          Update
        </Button>
      </Box>
      <Box sx={{ display: 'flex' }}>
        <TextField
          value={`curl -X GET '${env.APP_BASE_URL}/api/${key}?${demoQuery}'`}
          slotProps={{
            input: {
              readOnly: true,
            },
          }}
        />
        <Button
          onClick={(e) => {
            e.preventDefault();
            navigator.clipboard.writeText(
              `curl -X GET '${env.APP_BASE_URL}/api/${key}?${demoQuery}'`
            );
            setCopied(true);
          }}
        >
          {copied ? <SuccessIcon /> : <DefaultIcon />}
        </Button>
      </Box>
    </Stack>
  );
}
