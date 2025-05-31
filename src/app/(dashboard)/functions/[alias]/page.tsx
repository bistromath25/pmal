'use client';

import { useParams } from 'next/navigation';
import FunctionView from '@/components/FunctionView';
import { Box } from '@mui/material';

export default function Page() {
  const { alias } = useParams() as { alias: string };
  return (
    <Box>
      <FunctionView alias={alias} />
    </Box>
  );
}
