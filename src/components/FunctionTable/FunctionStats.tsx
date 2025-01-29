import { useFunctionContext } from '@/contexts/functionContext';
import { ExecutionEntry } from '@/types/ExecutionEntry';
import { Function } from '@/types/Function';

function StatDetail({
  label,
  value,
}: {
  label: string;
  value: string | number;
}) {
  return (
    <div className='flex flex-col bg-white border border-[rgb(227_232_239)] shadow-sm rounded-lg p-1 md:p-4'>
      <p className='font-bold text-2xl'>{value}</p>
      <p>{label}</p>
    </div>
  );
}

export default function FunctionStats() {
  const { functions, executionEntries } = useFunctionContext();
  const totalCalls = functions.reduce((c, f: Function) => c + f.total_calls, 0);
  const totalTime = executionEntries.reduce(
    (t, e: ExecutionEntry) => t + (e.time ?? 0),
    0
  );
  const stats = [
    { label: 'Functions', value: functions.length },
    { label: 'Calls', value: totalCalls },
    { label: 'Runtime', value: `${totalTime} ms` },
    { label: 'Saved', value: `$${(totalTime * 0.0000000021).toFixed(10)}` },
  ];
  return (
    <div className='grid grid-cols-4 gap-6'>
      {stats.map(({ label, value }) => (
        <StatDetail
          key={`function-stats-${label}`}
          label={label}
          value={value}
        />
      ))}
    </div>
  );
}
