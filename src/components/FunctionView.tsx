'use client';

import { useCallback, useEffect, useMemo, useState } from 'react';
import { useFunction } from '@/contexts/function';
import { env } from '@/env';
import { FunctionRecord } from '@/types';
import {
  formatDate,
  formatRelativeDate,
  getDemoQuery,
  languageOptions,
} from '@/utils';
import DeleteModal from './DeleteModal';
import Editor from './Editor';
import RecentActivity from './RecentActivity';
import CheckIcon from '@mui/icons-material/Check';
import ContentCopyIcon from '@mui/icons-material/ContentCopy';
import { Box, Button, Stack, Tooltip, Typography } from '@mui/material';

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
    if (!fun?.id || !code) return;
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
    return (
      <Typography variant='h4' sx={{ color: '#0f172a' }}>
        No function found
      </Typography>
    );
  }

  return (
    <>
      <Stack spacing={3}>
        {/* Header row */}
        <Stack
          direction='row'
          alignItems='center'
          justifyContent='space-between'
          flexWrap='wrap'
          gap={2}
        >
          <Stack direction='row' alignItems='center' spacing={2}>
            <Box
              sx={{
                width: 40,
                height: 40,
                borderRadius: '10px',
                background: '#f1f5f9',
                border: '1px solid #e2e8f0',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
              }}
            >
              <img
                src={
                  languageOptions.find(({ name }) => name === fun.language)
                    ?.logoUrl
                }
                alt={fun.language}
                width={22}
                height={22}
              />
            </Box>
            <Stack spacing={0}>
              <Typography
                variant='h5'
                sx={{
                  fontWeight: 700,
                  color: '#0f172a',
                  fontFamily: 'monospace',
                  letterSpacing: '-0.01em',
                }}
              >
                {alias}
              </Typography>
              <Typography variant='caption' sx={{ color: '#94a3b8' }}>
                Updated {formatRelativeDate(fun.updated_at || fun.created_at)}
              </Typography>
            </Stack>
          </Stack>

          <Stack direction='row' spacing={1}>
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

        {/* Metadata cards */}
        <Details fun={fun} />

        {/* Recent activity */}
        <RecentActivity fun={fun} />

        {/* Editor */}
        <Stack spacing={1.5}>
          <Typography
            variant='overline'
            sx={{ color: '#94a3b8', fontWeight: 700, letterSpacing: '0.1em' }}
          >
            Code
          </Typography>
          <Box
            sx={{
              border: '1px solid #e2e8f0',
              borderRadius: '12px',
              overflow: 'hidden',
            }}
          >
            <Editor
              code={code}
              setCode={setCode}
              language={language}
              onSave={handleSave}
            />
          </Box>
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
  const [copied, setCopied] = useState(false);
  const demoQuery = getDemoQuery(fun.code, fun.language);
  const url = `${env.APP_BASE_URL}/api/${fun.alias}${demoQuery ? `?${demoQuery}` : ''}`;

  const handleCopy = () => {
    navigator.clipboard.writeText(url);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <Box
      sx={{
        display: 'grid',
        gridTemplateColumns: { xs: '1fr 1fr', sm: 'repeat(4, 1fr)' },
        gap: 2,
      }}
    >
      <MetaStat label='Total calls' value={String(fun.total_calls)} />
      <MetaStat label='Language' value={fun.language.toUpperCase()} />
      <MetaStat label='Created' value={formatDate(fun.created_at)} />
      <MetaStat
        label='Updated'
        value={formatDate(fun.updated_at || fun.created_at)}
      />

      {/* URL spans full width */}
      <Tooltip title={copied ? 'Copied!' : 'Copy URL'}>
        <Box
          onClick={handleCopy}
          sx={{
            gridColumn: '1 / -1',
            background: '#fff',
            border: '1px solid',
            borderColor: copied ? '#bfdbfe' : '#e2e8f0',
            borderRadius: '10px',
            px: 2,
            py: 1.5,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            gap: 2,
            cursor: 'pointer',
            transition: 'border-color 0.15s, background 0.15s',
            '&:hover': {
              background: '#f8fafc',
              borderColor: '#94a3b8',
            },
          }}
        >
          <Stack spacing={0.25} sx={{ minWidth: 0 }}>
            <Typography
              variant='caption'
              sx={{
                color: '#94a3b8',
                textTransform: 'uppercase',
                letterSpacing: '0.08em',
                fontWeight: 700,
                fontSize: '0.68rem',
              }}
            >
              Endpoint
            </Typography>
            <Typography
              variant='body2'
              sx={{
                fontFamily: 'monospace',
                color: '#334155',
                fontSize: '0.8rem',
                overflow: 'hidden',
                textOverflow: 'ellipsis',
                whiteSpace: 'nowrap',
              }}
            >
              {url}
            </Typography>
          </Stack>
          <Box sx={{ color: '#94a3b8', flexShrink: 0, display: 'flex' }}>
            {copied ? (
              <CheckIcon fontSize='small' />
            ) : (
              <ContentCopyIcon fontSize='small' />
            )}
          </Box>
        </Box>
      </Tooltip>
    </Box>
  );
}

function MetaStat({ label, value }: { label: string; value: string }) {
  return (
    <Box
      sx={{
        background: '#fff',
        border: '1px solid #e2e8f0',
        borderRadius: '10px',
        px: 2,
        py: 1.5,
      }}
    >
      <Typography
        variant='caption'
        sx={{
          color: '#94a3b8',
          textTransform: 'uppercase',
          letterSpacing: '0.08em',
          fontWeight: 700,
          fontSize: '0.68rem',
        }}
      >
        {label}
      </Typography>
      <Typography
        variant='body2'
        sx={{ color: '#0f172a', fontWeight: 600, mt: 0.5 }}
      >
        {value}
      </Typography>
    </Box>
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
