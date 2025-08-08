import { useFunction } from '@/contexts/function';
import { Box, Stack, Typography } from '@mui/material';

function StatCard({ label, value }: { label: string; value: string | number }) {
  return (
    <Box
      sx={{
        flex: 1,
        background: '#fff',
        border: '1px solid #e2e8f0',
        borderRadius: '12px',
        px: 2.5,
        py: 2,
        transition: 'box-shadow 0.15s',
        '&:hover': { boxShadow: '0 4px 16px rgba(0,0,0,0.06)' },
      }}
    >
      <Typography
        variant='caption'
        sx={{
          color: '#94a3b8',
          textTransform: 'uppercase',
          letterSpacing: '0.08em',
          fontWeight: 700,
          fontSize: '0.68rem',
        }}
      >
        {label}
      </Typography>
      <Typography
        variant='h5'
        sx={{
          color: '#0f172a',
          fontWeight: 700,
          mt: 0.5,
          letterSpacing: '-0.02em',
        }}
      >
        {value}
      </Typography>
    </Box>
  );
}

export default function FunctionStats() {
  const { functions, totalCount, executionEntries } = useFunction();
  const totalCalls = functions.reduce(
    (c, { total_calls }) => c + total_calls,
    0
  );
  const totalTime = executionEntries.reduce(
    (t, { time }) => t + (time ?? 0),
    0
  );
  const stats = [
    { label: 'Functions', value: totalCount },
    { label: 'Total calls', value: totalCalls },
    { label: 'Runtime', value: `${totalTime} ms` },
    { label: 'Saved', value: `$${(totalTime * 0.0000000021).toFixed(10)}` },
  ];
  return (
    <Stack direction='row' gap={2} flexWrap='wrap'>
      {stats.map(({ label, value }) => (
        <StatCard key={label} label={label} value={value} />
      ))}
    </Stack>
  );
}
