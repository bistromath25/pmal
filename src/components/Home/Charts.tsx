import { useMemo } from 'react';
import { useFunctionContext } from '@/contexts/functionContext';
import { formatDate } from '@/utils/utils';
import { BarChart, LineChart } from '@mui/x-charts';

function CallsAndRuntimeLineChart() {
  const { executionEntries } = useFunctionContext();
  const data = useMemo(() => {
    return [
      ...executionEntries.reduce((m, { started_at, time }) => {
        const date = formatDate(started_at, false);
        const entry = m.get(date) || { calls: 0, runtime: 0 };
        m.set(date, {
          calls: entry.calls + 1,
          runtime: entry.runtime + (time ?? 0),
        });
        return m;
      }, new Map()),
    ]
      .map(([date, { calls, runtime }]) => ({
        date: new Date(date),
        calls,
        runtime,
      }))
      .sort((a, b) => a.date.getTime() - b.date.getTime());
  }, [executionEntries]);
  return (
    <div className='bg-white border border-[rgb(227_232_239)] shadow-sm rounded-lg p-1 md:p-4'>
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
          { scaleType: 'linear', tickMinStep: 1, min: 0 },
          { id: 'left', scaleType: 'linear', tickMinStep: 1, min: 0 },
          { id: 'right', scaleType: 'linear', tickMinStep: 200, min: 0 },
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
        leftAxis='left'
        rightAxis='right'
        height={400}
        sx={{ width: '100%' }}
      />
    </div>
  );
}

function EntryBarChart() {
  const { executionEntries } = useFunctionContext();
  const data = useMemo(() => {
    return executionEntries
      .map((d) => ({
        date: new Date(d.started_at),
        runtime: d.time ?? 0,
        alias: d.function_alias,
      }))
      .sort((a, b) => a.date.getTime() - b.date.getTime())
      .slice(-30);
  }, [executionEntries]);
  return (
    <div className='bg-white border border-[rgb(227_232_239)] shadow-sm rounded-lg'>
      <p className='p-4 pb-0 font-bold text-2xl'>Runtime Analytics</p>
      <BarChart
        xAxis={[
          { scaleType: 'band', data: data.map((d) => d.date.toISOString()) },
        ]}
        series={[{ data: data.map((d) => d.runtime), color: 'rgb(37,99,235)' }]}
        height={450}
        sx={{ width: '100%' }}
      />
    </div>
  );
}

function EntryList() {
  const { executionEntries } = useFunctionContext();
  const data = useMemo(() => {
    return executionEntries
      .map((d) => ({
        date: new Date(d.started_at),
        runtime: d.time ?? 0,
        alias: d.function_alias,
      }))
      .sort((a, b) => a.date.getTime() - b.date.getTime())
      .slice(-6);
  }, [executionEntries]);
  return (
    <div className='bg-white border border-[rgb(227_232_239)] shadow-sm rounded-lg'>
      <p className='p-4 font-bold text-2xl'>Recent activity</p>
      <div className='relative overflow-scroll'>
        <table className='w-full text-sm text-left rtl:text-right'>
          <thead className='border-b border-t rgb(227_232_239) text-gray-600'>
            <tr>
              <th scope='col' className='p-4 font-bold'>
                Time
              </th>
              <th scope='col' className='p-4 font-bold'>
                Function
              </th>
              <th scope='col' className='p-4 font-bold'>
                Runtime
              </th>
            </tr>
          </thead>
          <tbody>
            {data.map((d, i) => {
              return (
                <tr
                  className='border-b rgb(227_232_239)'
                  key={`entry-${d.alias}-${i}`}
                >
                  <th scope='row' className='p-4 font-medium whitespace-nowrap'>
                    {d.date.toISOString()}
                  </th>
                  <td className='p-4'>{d.alias}</td>
                  <td className='p-4'>{d.runtime}</td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
}

export default function FunctionCharts() {
  return (
    <>
      <EntryBarChart />
      <div className='grid grid-cols-1 sm:grid-cols-[65%_35%] gap-6 pr-0 pr-0 sm:pr-6'>
        <CallsAndRuntimeLineChart />
        <EntryList />
      </div>
    </>
  );
}
