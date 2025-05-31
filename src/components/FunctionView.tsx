'use client';

import { useCallback, useEffect, useMemo } from 'react';
import { useRouter } from 'next/navigation';
import { useFunction } from '@/contexts/function';
import { env } from '@/env';
import { FunctionRecord } from '@/types-v2';
import { formatDate } from '@/utils';
import Editor from './Editor';
import { Button, Stack, Typography } from '@mui/material';

interface FunctionViewProps {
  alias: string;
}

export default function FunctionView({ alias }: FunctionViewProps) {
  const router = useRouter();
  const {
    getFunctionByAlias,
    code,
    setCode,
    language,
    setLanguage,
    updateFunction,
    deleteFunction,
  } = useFunction();

  const fun = useMemo(
    () => getFunctionByAlias(alias),
    [getFunctionByAlias, alias]
  );

  const handleSave = useCallback(async () => {
    if (!fun?.id || !code) {
      return;
    }
    await updateFunction({ id: fun.id, code });
  }, [fun?.id, code, updateFunction]);

  const handleDelete = useCallback(async () => {
    if (!fun?.id) {
      return;
    }
    await deleteFunction(fun.id);
    router.push('/functions');
  }, [fun?.id, deleteFunction, router]);

  useEffect(() => {
    if (fun) {
      setCode(fun.code);
      setLanguage(fun.language);
    }
  }, [fun, setCode, setLanguage]);

  if (!fun) {
    return <Typography>No function</Typography>;
  }
  return (
    <Stack gap={2}>
      <Typography variant='h4'>{alias}</Typography>
      <Details fun={fun} />
      <Editor code={code} setCode={setCode} language={language} />
      <Stack flexDirection='row' gap={2}>
        <Button onClick={handleSave} variant='contained'>
          Save
        </Button>
        <Button onClick={handleDelete} variant='outlined' color='error'>
          Delete
        </Button>
      </Stack>
    </Stack>
  );
}

function Details({ fun }: { fun: FunctionRecord }) {
  return (
    <Stack>
      <Typography>Total calls: {fun.total_calls}</Typography>
      <Typography>Language: {fun.language}</Typography>
      <Typography>Created at: {formatDate(fun.created_at)}</Typography>
      <Typography>
        Updated at: {formatDate(fun.updated_at || fun.created_at)}
      </Typography>
      <Typography>URL: {`${env.APP_BASE_URL}/${fun.alias}`}</Typography>
    </Stack>
  );
}
