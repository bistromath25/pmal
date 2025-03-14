import { useFunctionContext } from '@/contexts/functionContext';

function StatDetail({
  label,
  value,
}: {
  label: string;
  value: string | number;
}) {
  return (
    <div className='flex flex-col'>
      <p className='font-bold text-2xl'>{value}</p>
      <p>{label}</p>
    </div>
  );
}

export default function FunctionStats() {
  const { functions, executionEntries } = useFunctionContext();
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
    <div className='grid grid-cols-1 sm:grid-cols-4 gap-6 bg-white border border-[rgb(227_232_239)] shadow-sm rounded-lg p-4'>
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
