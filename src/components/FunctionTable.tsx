'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useFunction } from '@/contexts/function';
import { FunctionRecord } from '@/types';
import { formatDate, formatRelativeDate, languageOptions } from '@/utils';
import DeleteModal from './DeleteModal';
import { Detail } from './FunctionView';
import DeleteOutlineIcon from '@mui/icons-material/DeleteOutline';
import EditOutlinedIcon from '@mui/icons-material/EditOutlined';
import {
  Box,
  Button,
  Grid,
  IconButton,
  Stack,
  Tooltip,
  Typography,
} from '@mui/material';

export default function FunctionTable() {
  const { functions, currentFunction } = useFunction();
  const [deleteModalIsOpen, setDeleteModalIsOpen] = useState(false);

  return (
    <Stack spacing={0}>
      <Grid container spacing={2}>
        {functions.map((fun, index) => (
          <Grid key={index} size={{ xs: 12, sm: 6, lg: 4 }}>
            <FunctionCard
              fun={fun}
              setDeleteModalIsOpen={setDeleteModalIsOpen}
            />
          </Grid>
        ))}
      </Grid>
      <DeleteModal
        modalIsOpen={deleteModalIsOpen}
        onClose={() => setDeleteModalIsOpen(false)}
        fun={currentFunction}
      />
    </Stack>
  );
}

export function Details({
  fun,
  setDeleteModalIsOpen,
}: {
  fun: FunctionRecord;
  setDeleteModalIsOpen: React.Dispatch<React.SetStateAction<boolean>>;
}) {
  const { setCurrentFunction } = useFunction();
  const logo = languageOptions.find(
    ({ name }) => name === fun.language
  )!.logoUrl;

  const handleDelete = () => {
    setCurrentFunction(fun);
    setDeleteModalIsOpen(true);
  };

  return (
    <Stack direction='row' alignItems='center' gap={2}>
      <Box flex='1' display='flex' justifyContent='center'>
        <img src={logo} alt={fun.language} height='48px' width='48px' />
      </Box>
      <Box flex='10'>
        <Stack>
          <Typography fontWeight='bold'>{fun.alias}</Typography>
          <Detail label='Total calls' value={fun.total_calls} />
          <Detail label='Created at' value={formatDate(fun.created_at)} />
          <Detail
            label='Updated at'
            value={formatDate(fun.updated_at || fun.created_at)}
          />
        </Stack>
      </Box>
      <Box flex='1'>
        <Stack spacing={1}>
          <Button
            component={Link}
            href={`/functions/${fun.alias}`}
            variant='contained'
            fullWidth
          >
            Edit
          </Button>
          <Button
            onClick={handleDelete}
            variant='outlined'
            color='error'
            fullWidth
          >
            Delete
          </Button>
        </Stack>
      </Box>
    </Stack>
  );
}

function FunctionCard({
  fun,
  setDeleteModalIsOpen,
}: {
  fun: FunctionRecord;
  setDeleteModalIsOpen: React.Dispatch<React.SetStateAction<boolean>>;
}) {
  const { setCurrentFunction } = useFunction();
  const logo = languageOptions.find(
    ({ name }) => name === fun.language
  )!.logoUrl;

  const handleDelete = () => {
    setCurrentFunction(fun);
    setDeleteModalIsOpen(true);
  };

  return (
    <Box
      sx={{
        background: '#fff',
        border: '1px solid #e2e8f0',
        borderRadius: '12px',
        p: 2.5,
        transition: 'border-color 0.15s, box-shadow 0.15s',
        '&:hover': {
          borderColor: '#bfdbfe',
          boxShadow: '0 4px 16px rgba(0,0,0,0.07)',
        },
      }}
    >
      <Stack spacing={2}>
        <Stack
          direction='row'
          alignItems='center'
          justifyContent='space-between'
        >
          <Stack direction='row' alignItems='center' spacing={1.5}>
            <img src={logo} alt={fun.language} height={24} width={24} />
            <Typography
              variant='body2'
              sx={{
                fontWeight: 700,
                color: '#0f172a',
                fontFamily: 'monospace',
              }}
            >
              {fun.alias}
            </Typography>
          </Stack>
          <Stack direction='row' spacing={0.5}>
            <Tooltip title='Edit'>
              <IconButton
                component={Link}
                href={`/functions/${fun.alias}`}
                size='small'
                sx={{
                  color: '#94a3b8',
                  '&:hover': {
                    color: '#0f172a',
                    background: 'rgba(0,0,0,0.05)',
                  },
                }}
              >
                <EditOutlinedIcon fontSize='small' />
              </IconButton>
            </Tooltip>
            <Tooltip title='Delete'>
              <IconButton
                onClick={handleDelete}
                size='small'
                sx={{
                  color: '#94a3b8',
                  '&:hover': {
                    color: '#ef4444',
                    background: 'rgba(239,68,68,0.08)',
                  },
                }}
              >
                <DeleteOutlineIcon fontSize='small' />
              </IconButton>
            </Tooltip>
          </Stack>
        </Stack>

        <Box
          sx={{
            display: 'grid',
            gridTemplateColumns: '1fr 1fr',
            gap: 1,
          }}
        >
          <Stat label='Total calls' value={String(fun.total_calls)} />
          <Stat label='Language' value={fun.language.toUpperCase()} />
          <Stat label='Created' value={formatRelativeDate(fun.created_at)} />
          <Stat
            label='Updated'
            value={formatRelativeDate(fun.updated_at || fun.created_at)}
          />
        </Box>
      </Stack>
    </Box>
  );
}

function Stat({ label, value }: { label: string; value: string }) {
  return (
    <Stack spacing={0.25}>
      <Typography
        variant='caption'
        sx={{
          color: '#94a3b8',
          fontSize: '0.7rem',
          textTransform: 'uppercase',
          letterSpacing: '0.06em',
        }}
      >
        {label}
      </Typography>
      <Typography
        variant='body2'
        sx={{ color: '#334155', fontWeight: 500, fontSize: '0.8rem' }}
      >
        {value}
      </Typography>
    </Stack>
  );
}
