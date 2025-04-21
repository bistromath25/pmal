import { useFunction } from '@/contexts/function';
import { Box, Paper, Stack, Typography } from '@mui/material';

function StatDetail({
  label,
  value,
}: {
  label: string;
  value: string | number;
}) {
  return (
    <Stack>
      <Typography variant='h6'>{value}</Typography>
      <Typography variant='h6'>{label}</Typography>
    </Stack>
  );
}

export default function FunctionStats() {
  const { functions, executionEntries } = useFunction();
  const totalCalls = functions.reduce(
    (c, { total_calls }) => c + total_calls,
    0
  );
  const totalTime = executionEntries.reduce(
    (t, { time }) => t + (time ?? 0),
    0
  );
  const stats = [
    { label: 'Functions', value: functions.length },
    { label: 'Calls', value: totalCalls },
    { label: 'Runtime', value: `${totalTime} ms` },
    { label: 'Saved', value: `$${(totalTime * 0.0000000021).toFixed(10)}` },
  ];
  return (
    <Paper sx={{ display: 'flex', p: 2, gap: 4, borderRadius: '4px' }}>
      {stats.map(({ label, value }) => (
        <Box sx={{ flexBasis: '25%' }} key={`function-stats-${label}`}>
          <StatDetail label={label} value={value} />
        </Box>
      ))}
    </Paper>
  );
}
