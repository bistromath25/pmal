'use client';

import { useState } from 'react';
import CreateModal from './CreateModal';
import FunctionTable from './FunctionTable';
import { Box, Button, Stack, Typography } from '@mui/material';

export default function FunctionTableWrapper() {
  const [modalIsOpen, setModalIsOpen] = useState(false);
  return (
    <>
      <Stack spacing={2}>
        <Typography variant='h4' sx={{ fontWeight: 'bold' }}>
          Functions
        </Typography>
        <Box>
          <Button variant='contained' onClick={() => setModalIsOpen(true)}>
            Create
          </Button>
        </Box>
        <FunctionTable />
      </Stack>
      <CreateModal
        modalIsOpen={modalIsOpen}
        onClose={() => setModalIsOpen(false)}
      />
    </>
  );
}
