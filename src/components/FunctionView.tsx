'use client';

import { useCallback, useEffect, useMemo, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useFunction } from '@/contexts/function';
import { env } from '@/env';
import { FunctionRecord } from '@/types';
import { formatLocalDate, getDemoQuery } from '@/utils';
import Editor from './Editor';
import Modal from './Modal';
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
    currentFunction,
    setCurrentFunction,
    updateFunction,
    deleteFunction,
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
      setCurrentFunction(fun);
    }
  }, [fun, setCode, setLanguage, setCurrentFunction]);

  if (!fun) {
    return <Typography variant='h4'>No function</Typography>;
  }
  return (
    <>
      <Stack gap={2}>
        <Typography variant='h4'>{alias}</Typography>
        <Details fun={fun} />
        <Editor code={code} setCode={setCode} language={language} />
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
      <Modal
        modalIsOpen={deleteModalIsOpen}
        onClose={() => setDeleteModalIsOpen(false)}
        title={`Delete function ${currentFunction?.alias}?`}
        contents={
          <Typography variant='body1' color='text.secondary'>
            Are you sure you want to delete this function? This action cannot be
            undone.
          </Typography>
        }
        actions={
          <Stack
            flexDirection='row'
            sx={{ justifyContent: 'flex-end', display: 'flex', gap: 2 }}
          >
            <Button
              variant='outlined'
              onClick={() => {
                setDeleteModalIsOpen(false);
                setCurrentFunction(null);
              }}
            >
              No, Cancel
            </Button>
            <Button
              variant='contained'
              color='error'
              onClick={() => {
                handleDelete();
                setDeleteModalIsOpen(false);
              }}
            >
              Yes, I'm sure
            </Button>
          </Stack>
        }
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
      <Detail
        label='Created at'
        value={formatLocalDate(new Date(fun.created_at))}
      />
      <Detail
        label='Updated at'
        value={formatLocalDate(new Date(fun.updated_at || fun.created_at))}
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
