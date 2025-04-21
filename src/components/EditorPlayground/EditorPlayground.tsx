'use client';

import { useEffect, useState } from 'react';
import { useSearchParams } from 'next/navigation';
import * as API from '@/app/api/api';
import { useFunction } from '@/contexts/function';
import { useUser } from '@/contexts/user';
import { APP_BASE_URL } from '@/env/env';
import useWrappedRequest from '@/hooks/useWrappedRequest';
import { isValidFunction } from '@/utils/functions';
import { getDemoQuery } from '@/utils/functions';
import Editor from '../Editor';
import { DefaultIcon, SuccessIcon } from '../Icons';
import LanguageSelection from '../LanguageSelection';
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
          value={`curl -X GET '${APP_BASE_URL}/api/${key}?${demoQuery}'`}
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
              `curl -X GET '${APP_BASE_URL}/api/${key}?${demoQuery}'`
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
