'use client';

import { useState } from 'react';
import { useFunction } from '@/contexts/function';
import CreateModal from './CreateModal';
import FunctionTable from './FunctionTable';
import { Box, Button, Stack, Typography, Pagination } from '@mui/material';

export default function FunctionTableWrapper() {
  const [modalIsOpen, setModalIsOpen] = useState(false);
  const { totalPages, currentPage, setCurrentPage } = useFunction();
  return (
    <>
      <Stack spacing={2}>
        <Typography variant='h4' sx={{ fontWeight: 'bold' }}>
          Functions
        </Typography>
        <Stack
          direction='row'
          alignItems='center'
          justifyContent='space-between'
        >
          <Button variant='contained' onClick={() => setModalIsOpen(true)}>
            Create
          </Button>
          {totalPages > 1 && (
            <Pagination
              count={totalPages}
              page={currentPage}
              onChange={(_, value) => setCurrentPage(value)}
              color='primary'
              size='medium'
            />
          )}
        </Stack>
        <Box sx={{ mt: 1 }}>
          <FunctionTable />
        </Box>
      </Stack>
      <CreateModal
        modalIsOpen={modalIsOpen}
        onClose={() => setModalIsOpen(false)}
      />
    </>
  );
}
