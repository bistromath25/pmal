import { useMemo } from 'react';
import { useFunction } from '@/contexts/function';
import { formatLocalDate, getAlias } from '@/utils';
import {
  Box,
  Paper,
  Stack,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Typography,
} from '@mui/material';
import { BarChart, LineChart } from '@mui/x-charts';

function CallsAndRuntimeLineChart() {
  const { executionEntries } = useFunction();
  const data = useMemo(() => {
    return [
      ...executionEntries.reduce((m, { started_at, time }) => {
        const date = formatLocalDate(new Date(started_at), false);
        const entry = m.get(date) || { calls: 0, runtime: 0 };
        m.set(date, {
          calls: entry.calls + 1,
          runtime: entry.runtime + (time ?? 0),
        });
        return m;
      }, new Map()),
    ].map(([date, { calls, runtime }]) => ({
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
  const data = useMemo(() => {
    return executionEntries
      .map((d) => ({
        date: new Date(d.started_at),
        runtime: d.time ?? 0,
        alias: getAlias(d.function_id),
      }))
      .slice(-30);
  }, [executionEntries]);
  return (
    <Box>
      <Typography variant='h5'>Runtime Analytics</Typography>
      <BarChart
        xAxis={[{ scaleType: 'band', data: data.map((d) => d.date.toLocaleString()) }]}
        series={[{ data: data.map((d) => d.runtime), color: 'rgb(37,99,235)' }]}
        height={450}
        sx={{ width: '100%' }}
      />
    </Box>
  );
}

function EntryList() {
  const { executionEntries } = useFunction();
  const data = useMemo(() => {
    return executionEntries
      .map((d) => ({
        date: new Date(d.started_at),
        runtime: d.time ?? 0,
        alias: getAlias(d.function_id),
      }))
      .slice(-6);
  }, [executionEntries]);
  return (
    <Stack spacing={2}>
      <Typography variant='h5'>Recent activity</Typography>
      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Time</TableCell>
              <TableCell>Function</TableCell>
              <TableCell>Runtime</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {data.map((d, i) => {
              return (
                <TableRow key={`entry-${d.alias}-${i}`}>
                  <TableCell>{d.date.toLocaleString()}</TableCell>
                  <TableCell>{d.alias}</TableCell>
                  <TableCell>{d.runtime}</TableCell>
                </TableRow>
              );
            })}
          </TableBody>
        </Table>
      </TableContainer>
    </Stack>
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
          <EntryList />
        </Box>
      </Box>
    </Stack>
  );
}
