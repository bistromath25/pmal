'use client';

import { Stack, Typography } from '@mui/material';

export default function HomeWrapper() {
  return (
    <Stack spacing={2}>
      <Typography variant='h4' sx={{ fontWeight: 'bold' }}>
        Home
      </Typography>
    </Stack>
  );
}
