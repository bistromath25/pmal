'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useFunction } from '@/contexts/function';
import { FunctionRecord } from '@/types';
import {
  formatLocalDate,
  getEndOfDay,
  getStartOfDay,
  languageOptions,
} from '@/utils';
import DateRangeFilter from './DateRangeFilter';
import DeleteModal from './DeleteModal';
import { Detail } from './FunctionView';
import Search from './Search';
import { Box, Button, Grid, Paper, Stack, Typography } from '@mui/material';

export default function FunctionTable() {
  const { functions, currentFunction } = useFunction();
  const [deleteModalIsOpen, setDeleteModalIsOpen] = useState(false);
  const [searchValue, setSearchValue] = useState<string>('');
  const [searchedValues, setSearchedValues] = useState<string[]>([]);
  const [startDate, setStartDate] = useState<string>('');
  const [endDate, setEndDate] = useState<string>('');

  const filteredFunctions = functions.filter(({ created_at, alias }) => {
    const entryDate = new Date(created_at);
    if (
      getStartOfDay(entryDate.toString(), false) <
      getStartOfDay(startDate || new Date(0).toString(), true)
    ) {
      return false;
    }
    if (
      getStartOfDay(entryDate.toString(), false) >
      getEndOfDay(
        endDate || new Date(Date.now() + 24 * 60 * 60 * 1000).toString(),
        true
      )
    ) {
      return false;
    }

    if (searchedValues.length) {
      const match = searchedValues.some((value) => alias.includes(value));
      if (!match) {
        return false;
      }
    }
    if (searchValue) {
      const match = alias.includes(searchValue);
      if (!match) {
        return false;
      }
    }

    return true;
  });

  return (
    <Stack spacing={2}>
      <Stack flexDirection='row' gap={2}>
        <Search
          searchValue={searchValue}
          setSearchValue={setSearchValue}
          searchedValues={searchedValues}
          setSearchedValues={setSearchedValues}
        />
        <DateRangeFilter
          startDate={startDate}
          onStartDateChange={setStartDate}
          endDate={endDate}
          onEndDateChange={setEndDate}
        />
      </Stack>
      <Grid container spacing={3}>
        {filteredFunctions.map((fun, index) => (
          <Grid key={index}>
            <Paper elevation={2} sx={{ padding: 2, borderRadius: 2 }}>
              <Details fun={fun} setDeleteModalIsOpen={setDeleteModalIsOpen} />
            </Paper>
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
          <Detail
            label='Created at'
            value={formatLocalDate(new Date(fun.created_at), false)}
          />
          <Detail
            label='Updated at'
            value={formatLocalDate(
              new Date(fun.updated_at || fun.created_at),
              false
            )}
          />
        </Stack>
      </Box>

      <Box flex='1'>
        <ActionButtons alias={fun.alias} onDelete={handleDelete} />
      </Box>
    </Stack>
  );
}

function ActionButtons({
  alias,
  onDelete,
}: {
  alias: string;
  onDelete: () => void;
}) {
  return (
    <Stack spacing={1}>
      <Button
        component={Link}
        href={`/functions/${alias}`}
        variant='contained'
        fullWidth
      >
        Edit
      </Button>
      <Button onClick={onDelete} variant='outlined' color='error' fullWidth>
        Delete
      </Button>
    </Stack>
  );
}
