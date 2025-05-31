'use client';

import { useCallback, useState } from 'react';
import Link from 'next/link';
import Modal from '@/components/Modal';
import { useFunction } from '@/contexts/function';
import { FunctionRecord } from '@/types-v2';
import { formatDate, getAlias, languageOptions } from '@/utils';
import { Box, Button, Grid, Paper, Stack, Typography } from '@mui/material';

export default function FunctionTable() {
  const { functions, currentFunction, setCurrentFunction, deleteFunction } =
    useFunction();
  const [deleteModalIsOpen, setDeleteModalIsOpen] = useState(false);

  const handleDelete = useCallback(async () => {
    if (!currentFunction) {
      return;
    }
    await deleteFunction(currentFunction.id);
  }, [currentFunction, deleteFunction]);

  return (
    <Stack>
      <Grid container spacing={3}>
        {functions.map((fun, index) => (
          <Grid key={index}>
            <Paper elevation={2} sx={{ padding: 2, borderRadius: 2 }}>
              <Detail fun={fun} setDeleteModalIsOpen={setDeleteModalIsOpen} />
            </Paper>
          </Grid>
        ))}
      </Grid>
      <Modal
        modalIsOpen={deleteModalIsOpen}
        onClose={() => setDeleteModalIsOpen(false)}
        title={`Delete function ${getAlias(currentFunction?.id || '')}?`}
        contents={
          <Stack spacing={2}>
            <Typography variant='body1'>
              Are you sure you want to delete this function? This action cannot
              be undone.
            </Typography>

            <Box sx={{ display: 'flex', gap: 2 }}>
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

              <Button
                variant='outlined'
                onClick={() => {
                  setDeleteModalIsOpen(false);
                  setCurrentFunction(null);
                }}
              >
                No, Cancel
              </Button>
            </Box>
          </Stack>
        }
      />
    </Stack>
  );
}

function Detail({
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
  const createdAt = formatDate(fun.created_at);
  const updatedAt = formatDate(fun.updated_at || fun.created_at);
  const alias = getAlias(fun.id);
  const totalCalls = fun.total_calls;

  return (
    <Stack direction='row' alignItems='center' gap={2}>
      <Box flex='1' display='flex' justifyContent='center'>
        <img src={logo} height='48px' width='48px' />
      </Box>

      <Box flex='10'>
        <Stack>
          <Typography fontWeight='bold'>{alias}</Typography>
          <Typography>Total calls: {totalCalls}</Typography>
          <Typography>Created at: {createdAt}</Typography>
          <Typography>Updated at: {updatedAt}</Typography>
        </Stack>
      </Box>

      <Box flex='1'>
        <Stack spacing={1}>
          <Button
            component={Link}
            href={`/functions/${alias}`}
            variant='contained'
            fullWidth
          >
            Edit
          </Button>
          <Button
            onClick={() => {
              setCurrentFunction(fun);
              setDeleteModalIsOpen(true);
            }}
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
