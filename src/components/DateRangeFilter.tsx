import { Stack, TextField } from '@mui/material';

interface DateRangeFilterProps {
  startDate: string;
  endDate: string;
  onStartDateChange: (value: string) => void;
  onEndDateChange: (value: string) => void;
}

export default function DateRangeFilter({
  startDate,
  endDate,
  onStartDateChange,
  onEndDateChange,
}: DateRangeFilterProps) {
  const handleStartDateChange = (value: string) => {
    onStartDateChange(value);
    if (endDate && value && endDate < value) {
      onEndDateChange(value);
    }
  };
  return (
    <Stack direction='row' sx={{ gap: 2 }}>
      <TextField
        label='From'
        type='date'
        size='small'
        value={startDate}
        onChange={(e) => handleStartDateChange(e.target.value)}
        InputLabelProps={{ shrink: true }}
      />
      <TextField
        label='To'
        type='date'
        size='small'
        value={endDate}
        onChange={(e) => onEndDateChange(e.target.value)}
        InputLabelProps={{ shrink: true }}
        inputProps={{
          min: startDate || undefined,
        }}
      />
    </Stack>
  );
}
