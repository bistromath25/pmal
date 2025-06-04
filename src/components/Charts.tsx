import { useMemo } from 'react';
import { useFunction } from '@/contexts/function';
import { formatDate } from '@/utils';
import RecentActivity from './RecentActivity';
import { Box, Paper, Stack, Typography } from '@mui/material';
import { BarChart, LineChart } from '@mui/x-charts';

function CallsAndRuntimeLineChart() {
  const { executionEntries } = useFunction();
  const data = useMemo(() => {
    const grouped = new Map<string, { calls: number; runtime: number }>();

    for (const { started_at, time } of executionEntries) {
      const dateKey = formatDate(started_at, false);
      const entry = grouped.get(dateKey) ?? { calls: 0, runtime: 0 };

      grouped.set(dateKey, {
        calls: entry.calls + 1,
        runtime: entry.runtime + (time ?? 0),
      });
    }

    return Array.from(grouped.entries()).map(([date, { calls, runtime }]) => ({
      date: new Date(date),
      calls,
      runtime,
    }));
  }, [executionEntries]);

  return (
    <LineChart
      xAxis={[
        {
          scaleType: 'utc',
          tickMinStep: 86_400_000,
          min: data[0]?.date,
          data: data.map((d) => d.date),
          valueFormatter: (date: Date) => date.toLocaleDateString(),
          tickPlacement: 'middle',
          tickLabelPlacement: 'middle',
        },
      ]}
      yAxis={[
        {
          id: 'left',
          scaleType: 'linear',
          tickMinStep: 1,
          min: 0,
          position: 'left',
        },
        {
          id: 'right',
          scaleType: 'linear',
          tickMinStep: 200,
          min: 0,
          position: 'right',
        },
      ]}
      series={[
        {
          id: 1,
          yAxisId: 'left',
          label: 'Calls',
          data: data.map((d) => d.calls),
          color: 'rgb(22,163,74)',
        },
        {
          id: 2,
          yAxisId: 'right',
          label: 'Runtime',
          data: data.map((d) => d.runtime),
          color: 'rgb(37,99,235)',
        },
      ]}
      height={400}
      sx={{ width: '100%' }}
    />
  );
}

function EntryBarChart() {
  const { executionEntries } = useFunction();
  const data = executionEntries.slice(0, 30);
  return (
    <Box>
      <Typography variant='h5'>Runtime Analytics</Typography>
      <BarChart
        xAxis={[
          {
            scaleType: 'band',
            data: data.map((d) => new Date(d.created_at).toISOString()),
          },
        ]}
        series={[{ data: data.map((d) => d.time), color: 'rgb(37,99,235)' }]}
        height={450}
        sx={{ width: '100%' }}
      />
    </Box>
  );
}

export default function FunctionCharts() {
  return (
    <Stack spacing={2}>
      <EntryBarChart />
      <Box sx={{ display: 'flex', gap: 4 }}>
        <Paper sx={{ flexBasis: '65%' }}>
          <CallsAndRuntimeLineChart />
        </Paper>
        <Box sx={{ flexBasis: '35%' }}>
          <RecentActivity />
        </Box>
      </Box>
    </Stack>
  );
}
