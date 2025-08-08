import { useMemo } from 'react';
import { useFunction } from '@/contexts/function';
import { formatDate } from '@/utils';
import RecentActivity from './RecentActivity';
import { Box, Stack, Typography } from '@mui/material';
import { BarChart, LineChart } from '@mui/x-charts';

function ChartCard({
  title,
  children,
}: {
  title: string;
  children: React.ReactNode;
}) {
  return (
    <Box
      sx={{
        background: '#fff',
        border: '1px solid #e2e8f0',
        borderRadius: '12px',
        p: 2.5,
      }}
    >
      <Typography
        variant='overline'
        sx={{ color: '#94a3b8', fontWeight: 700, letterSpacing: '0.1em' }}
      >
        {title}
      </Typography>
      {children}
    </Box>
  );
}

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
      height={320}
      sx={{ width: '100%' }}
    />
  );
}

function EntryBarChart() {
  const { executionEntries } = useFunction();
  const data = executionEntries.slice(0, 30);
  return (
    <BarChart
      xAxis={[
        {
          scaleType: 'band',
          data: data.map((d) => new Date(d.created_at).toISOString()),
        },
      ]}
      series={[{ data: data.map((d) => d.time), color: 'rgb(37,99,235)' }]}
      height={300}
      sx={{ width: '100%' }}
    />
  );
}

export default function FunctionCharts() {
  return (
    <Stack spacing={2}>
      <ChartCard title='Runtime Analytics'>
        <EntryBarChart />
      </ChartCard>
      <Box sx={{ display: 'flex', gap: 2, alignItems: 'flex-start' }}>
        <Box sx={{ flexBasis: '65%' }}>
          <ChartCard title='Calls & Runtime'>
            <CallsAndRuntimeLineChart />
          </ChartCard>
        </Box>
        <Box sx={{ flexBasis: '35%' }}>
          <RecentActivity />
        </Box>
      </Box>
    </Stack>
  );
}
