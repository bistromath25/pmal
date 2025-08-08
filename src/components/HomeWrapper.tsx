'use client';

import FunctionCharts from './Charts';
import FunctionStats from './Stats';
import { Stack, Typography } from '@mui/material';

export default function HomeWrapper() {
  return (
    <Stack spacing={3}>
      <Typography
        variant='h5'
        sx={{ fontWeight: 700, color: '#0f172a', letterSpacing: '-0.02em' }}
      >
        Home
      </Typography>
      <FunctionStats />
      <FunctionCharts />
    </Stack>
  );
}
