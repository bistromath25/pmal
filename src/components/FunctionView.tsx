'use client';

import { useCallback, useEffect, useMemo, useState } from 'react';
import { useFunction } from '@/contexts/function';
import { env } from '@/env';
import { FunctionRecord } from '@/types';
import { formatDate, getDemoQuery } from '@/utils';
import DeleteModal from './DeleteModal';
import Editor from './Editor';
import RecentActivity from './RecentActivity';
import { Button, Stack, Typography } from '@mui/material';

interface FunctionViewProps {
  alias: string;
}

export default function FunctionView({ alias }: FunctionViewProps) {
  const {
    getFunctionByAlias,
    code,
    setCode,
    language,
    setLanguage,
    setCurrentFunction,
    updateFunction,
  } = useFunction();
  const [deleteModalIsOpen, setDeleteModalIsOpen] = useState(false);

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

  useEffect(() => {
    if (fun) {
      setCode(fun.code);
      setLanguage(fun.language);
      setCurrentFunction(fun);
    }
  }, [fun, setCode, setLanguage, setCurrentFunction]);

  if (!fun) {
    return <Typography variant='h4'>No function</Typography>;
  }
  return (
    <>
      <Stack spacing={2}>
        <Typography variant='h4'>{alias}</Typography>
        <Details fun={fun} />
        <RecentActivity fun={fun} />
        <Stack spacing={1}>
          <Typography variant='h6'>Code</Typography>
          <Editor code={code} setCode={setCode} language={language} />
        </Stack>
        <Stack flexDirection='row' gap={2}>
          <Button onClick={handleSave} variant='contained'>
            Save
          </Button>
          <Button
            onClick={() => setDeleteModalIsOpen(true)}
            variant='outlined'
            color='error'
          >
            Delete
          </Button>
        </Stack>
      </Stack>
      <DeleteModal
        modalIsOpen={deleteModalIsOpen}
        onClose={() => setDeleteModalIsOpen(false)}
        fun={fun}
      />
    </>
  );
}

function Details({ fun }: { fun: FunctionRecord }) {
  const demoQuery = getDemoQuery(fun.code, fun.language);
  const url = `${env.APP_BASE_URL}/api/${fun.alias}${demoQuery ? `?${demoQuery}` : ''}`;
  return (
    <Stack>
      <Detail label='Total calls' value={fun.total_calls} />
      <Detail label='Language' value={fun.language} />
      <Detail label='Created at' value={formatDate(fun.created_at)} />
      <Detail
        label='Updated at'
        value={formatDate(fun.updated_at || fun.created_at)}
      />
      <Detail label='URL' value={url} />
    </Stack>
  );
}

export function Detail({
  label,
  value,
}: {
  label: string;
  value: React.ReactNode;
}) {
  return (
    <Typography>
      <Typography component='span' fontWeight='bold'>
        {label}:
      </Typography>{' '}
      {value}
    </Typography>
  );
}
