'use client';

import FunctionCharts from './Charts';
import FunctionStats from './Stats';
import { Stack, Typography } from '@mui/material';

export default function HomeWrapper() {
  return (
    <Stack spacing={2}>
      <Typography variant='h4' sx={{ fontWeight: 'bold' }}>
        Home
      </Typography>
      <FunctionStats />
      <FunctionCharts />
    </Stack>
  );
}
