'use client';

import { useCallback, useState } from 'react';
import { useFunction } from '@/contexts/function';
import { APP_BASE_URL } from '@/env/env';
import { Function } from '@/types/Function';
import { getDemoQuery, languageOptions } from '@/utils/functions';
import { formatDate } from '@/utils/utils';
import Editor from '../Editor';
import Modal from '../Modal';
import {
  Box,
  Button,
  Grid,
  Paper,
  Stack,
  TextField,
  Typography,
} from '@mui/material';

function FunctionDetails({ fun }: { fun: Function }) {
  const { executionEntries } = useFunction();
  const totalExecutionTime = executionEntries.reduce(
    (t, { function_alias, time }) =>
      t + (function_alias === fun.alias ? (time ?? 0) : 0),
    0
  );
  return (
    <Box sx={{ display: 'flex', gap: 2 }}>
      <Box sx={{ display: 'flex', gap: 1 }}>
        <Stack>
          <Typography variant='body1'>Total calls:</Typography>
          <Typography variant='body1'>Total time:</Typography>
          <Typography variant='body1'>Language:</Typography>
        </Stack>
        <Stack>
          <Typography variant='body1'>{fun.total_calls}</Typography>
          <Typography variant='body1'>{totalExecutionTime} ms</Typography>
          <Typography variant='body1'>{fun.language}</Typography>
        </Stack>
      </Box>
      <Box sx={{ display: 'flex', gap: 1 }}>
        <Stack>
          <Typography variant='body1'>Created at:</Typography>
          <Typography variant='body1'>Updated at:</Typography>
        </Stack>
        <Stack>
          <Typography variant='body1'>{formatDate(fun.created_at)}</Typography>
          <Typography variant='body1'>
            {formatDate(fun.updated_at ?? fun.created_at)}
          </Typography>
        </Stack>
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
  } = useFunction();
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
      <Grid container spacing={3}>
        {functions.map((fun: Function) => {
          const logo = languageOptions.find(
            ({ name }) => name === fun.language
          )?.logoUrl;
          const createdAtDateString = formatDate(fun.created_at, false);
          return (
            <Paper
              elevation={2}
              sx={{ padding: 2, borderRadius: 2 }}
              key={`function-box-${fun.alias}`}
            >
              <Box sx={{ display: 'flex', gap: 2 }}>
                <Stack
                  sx={{
                    display: 'flex',
                    flexBasis: '1/6',
                    justifyContent: 'center',
                  }}
                >
                  <img className='h-[50px]' src={logo} />
                </Stack>
                <Stack sx={{ flexBasis: '2/3' }}>
                  <Typography variant='h6'>{fun.alias}</Typography>
                  <Typography variant='body1'>
                    Calls: {fun.total_calls}
                  </Typography>
                  <Typography variant='body1'>
                    Created: {createdAtDateString}
                  </Typography>
                </Stack>
                <Stack
                  sx={{ flexBasis: '1/6', gap: 1, justifyContent: 'center' }}
                >
                  <Button
                    variant='contained'
                    onClick={() => openEditModal(fun)}
                  >
                    Edit
                  </Button>
                  <Button
                    variant='outlined'
                    color='error'
                    onClick={() => openDeleteModal(fun)}
                  >
                    Delete
                  </Button>
                </Stack>
              </Box>
            </Paper>
          );
        })}
      </Grid>
      <Modal
        modalIsOpen={deleteModalIsOpen}
        onClose={() => setDeleteModalIsOpen(false)}
        title={`Delete function ${currentFunction.alias}?`}
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
                  handleDeleteFunction(currentFunction.alias);
                  setDeleteModalIsOpen(false);
                }}
              >
                Yes, I'm sure
              </Button>
              <Button
                variant='outlined'
                onClick={() => setDeleteModalIsOpen(false)}
              >
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
                <Typography variant='body1'>URL:</Typography>
                <input
                  className='w-full px-1 cursor-copy focus:outline-none bg-transparent border border-gray-300 rounded-lg'
                  value={`${currentFunction.alias}?${getDemoQuery(currentFunction.code, currentFunction.language)}`}
                  onClick={(e) => {
                    e.preventDefault();
                    navigator.clipboard.writeText(
                      `${APP_BASE_URL}/api/${currentFunction.alias}?${getDemoQuery(currentFunction.code, currentFunction.language)}`
                    );
                  }}
                  readOnly
                />
                {/* <TextField
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
                /> */}
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
                variant='contained'
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
