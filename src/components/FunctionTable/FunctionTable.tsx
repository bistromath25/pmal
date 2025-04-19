'use client';

import { useCallback, useState } from 'react';
import { useFunctionContext } from '@/contexts/functionContext';
import { APP_BASE_URL } from '@/env/env';
import { Function } from '@/types/Function';
import { getDemoQuery, languageOptions } from '@/utils/functions';
import { formatDate } from '@/utils/utils';
import Editor from '../Editor';
import Modal from '../Modal';
import { Box, Button, Grid, Stack, TextField, Typography } from '@mui/material';

function FunctionDetails({ fun }: { fun: Function }) {
  const { executionEntries } = useFunctionContext();
  const totalExecutionTime = executionEntries.reduce(
    (t, { function_alias, time }) =>
      t + (function_alias === fun.alias ? (time ?? 0) : 0),
    0
  );
  return (
    <Box sx={{ display: 'flex', gap: 2 }}>
      <Box sx={{ display: 'flex', gap: 1 }}>
        <Box>
          <Typography variant='h6'>Total calls:</Typography>
          <Typography variant='h6'>Total time:</Typography>
          <Typography variant='h6'>Language:</Typography>
        </Box>
        <Box>
          <Typography variant='h6'>{fun.total_calls}</Typography>
          <Typography variant='h6'>{totalExecutionTime} ms</Typography>
          <Typography variant='h6'>{fun.language}</Typography>
        </Box>
      </Box>
      <Box sx={{ display: 'flex', gap: 1 }}>
        <Box>
          <Typography variant='h6'>Created at:</Typography>
          <Typography variant='h6'>Updated at:</Typography>
          <Typography variant='h6'>Language:</Typography>
        </Box>
        <Box>
          <Typography variant='h6'>{formatDate(fun.created_at)}</Typography>
          <Typography variant='h6'>
            {formatDate(fun.updated_at ?? fun.created_at)}
          </Typography>
        </Box>
      </Box>
    </Box>
  );
}

export interface FunctionTableProps {
  handleDeleteFunction: (alias: string) => Promise<void>;
  handleUpdateFunction: (fun: Function) => Promise<void>;
}

export default function FunctionTable({
  handleDeleteFunction,
  handleUpdateFunction,
}: FunctionTableProps) {
  const {
    code: currentCode,
    setCode: setCurrentCode,
    currentFunction,
    setCurrentFunction,
    functions,
  } = useFunctionContext();
  const [deleteModalIsOpen, setDeleteModalIsOpen] = useState(false);
  const [editModalIsOpen, setEditModalIsOpen] = useState(false);
  const [error, setError] = useState(false);
  const openEditModal = useCallback(
    (fun: Function) => {
      setCurrentCode(fun.code);
      setCurrentFunction(fun);
      setEditModalIsOpen(true);
    },
    [setCurrentCode, setCurrentFunction, setEditModalIsOpen]
  );
  const openDeleteModal = useCallback(
    (fun: Function) => {
      setCurrentFunction(fun);
      setDeleteModalIsOpen(true);
    },
    [setCurrentFunction, setDeleteModalIsOpen]
  );
  return functions && functions.length ? (
    <Box>
      <Grid container spacing={4}>
        {functions.map((fun: Function) => {
          const logo = languageOptions.find(
            ({ name }) => name === fun.language
          )?.logoUrl;
          const createdAtDateString = formatDate(fun.created_at, false);
          return (
            <Box key={`function-box-${fun.alias}`}>
              <Box sx={{ display: 'flex', gap: 2 }}>
                <Box sx={{ flexBasis: '1/6' }}>
                  <img className='h-[50px]' src={logo} />
                </Box>
                <Box sx={{ flexBasis: '2/3' }}>
                  <Typography variant='h5'>{fun.alias}</Typography>
                  <Typography variant='h6'>Calls: {fun.total_calls}</Typography>
                  <Typography variant='h6'>
                    Created: {createdAtDateString}
                  </Typography>
                </Box>
                <Stack sx={{ flexBasis: '1/6' }}>
                  <Button onClick={() => openEditModal(fun)}>Edit</Button>
                  <Button onClick={() => openDeleteModal(fun)}>Delete</Button>
                </Stack>
              </Box>
            </Box>
          );
        })}
      </Grid>
      <Modal
        modalIsOpen={deleteModalIsOpen}
        onClose={() => setDeleteModalIsOpen(false)}
        title={`Delete function ${currentFunction.alias}?`}
        contents={
          <Stack spacing={2}>
            <Typography variant='h6'>
              Are you sure you want to delete this function? This action cannot
              be undone.
            </Typography>
            <Box>
              <Button
                onClick={() => {
                  handleDeleteFunction(currentFunction.alias);
                  setDeleteModalIsOpen(false);
                }}
              >
                Yes, I'm sure
              </Button>
              <Button onClick={() => setDeleteModalIsOpen(false)}>
                No, Cancel
              </Button>
            </Box>
          </Stack>
        }
      />
      <Modal
        modalIsOpen={editModalIsOpen}
        onClose={() => setEditModalIsOpen(false)}
        title={`Edit function ${currentFunction.alias}`}
        contents={
          <Stack spacing={2}>
            <Box>
              <FunctionDetails fun={currentFunction} />
              <Box className='flex flex-row gap-2 pt-2'>
                <Typography variant='h6'>URL:</Typography>
                <TextField
                  value={`${currentFunction.alias}?${getDemoQuery(currentFunction.code, currentFunction.language)}`}
                  onClick={(e) => {
                    e.preventDefault();
                    navigator.clipboard.writeText(
                      `${APP_BASE_URL}/api/${currentFunction.alias}?${getDemoQuery(currentFunction.code, currentFunction.language)}`
                    );
                  }}
                  slotProps={{
                    input: {
                      readOnly: true,
                    },
                  }}
                />
              </Box>
            </Box>
            <Editor
              code={currentCode}
              setCode={setCurrentCode}
              language={currentFunction.language}
              style={{ minHeight: '300px' }}
              error={error}
              setError={setError}
            />
            <Box>
              <Button
                onClick={() => {
                  const newFunction = {
                    ...currentFunction,
                    code: currentCode,
                  };
                  setCurrentFunction(newFunction);
                  handleUpdateFunction(newFunction);
                  setEditModalIsOpen(false);
                }}
                disabled={error || !currentCode}
              >
                Save
              </Button>
            </Box>
          </Stack>
        }
        editor
      />
    </Box>
  ) : null;
}
