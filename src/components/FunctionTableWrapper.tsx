'use client';

import { useState } from 'react';
import { useFunction } from '@/contexts/function';
import CreateModal from './CreateModal';
import FunctionTable from './FunctionTable';
import AddIcon from '@mui/icons-material/Add';
import { Box, Button, Pagination, Stack, Typography } from '@mui/material';

export default function FunctionTableWrapper() {
  const [modalIsOpen, setModalIsOpen] = useState(false);
  const { totalPages, currentPage, setCurrentPage } = useFunction();

  return (
    <>
      <Stack spacing={3}>
        <Stack
          direction='row'
          alignItems='center'
          justifyContent='space-between'
        >
          <Typography
            variant='h5'
            sx={{ fontWeight: 700, color: '#0f172a', letterSpacing: '-0.02em' }}
          >
            Functions
          </Typography>
          <Button
            variant='contained'
            startIcon={<AddIcon />}
            onClick={() => setModalIsOpen(true)}
            sx={{
              fontWeight: 700,
              borderRadius: '8px',
            }}
          >
            New function
          </Button>
        </Stack>

        <Box>
          <FunctionTable />
        </Box>

        {totalPages > 1 && (
          <Box sx={{ display: 'flex', justifyContent: 'center' }}>
            <Pagination
              count={totalPages}
              page={currentPage}
              onChange={(_, value) => setCurrentPage(value)}
              color='primary'
              size='medium'
              sx={{
                '& .MuiPaginationItem-root': {
                  color: '#64748b',
                  '&.Mui-selected': {
                    background: 'rgba(59,130,246,0.1)',
                    color: '#3b82f6',
                  },
                  '&:hover': { background: 'rgba(0,0,0,0.05)' },
                },
              }}
            />
          </Box>
        )}
      </Stack>

      <CreateModal
        modalIsOpen={modalIsOpen}
        onClose={() => setModalIsOpen(false)}
      />
    </>
  );
}
