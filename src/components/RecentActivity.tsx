import { useFunction } from '@/contexts/function';
import { FunctionRecord } from '@/types';
import { formatLocalDate } from '@/utils';
import {
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

interface RecentActivityProps {
  fun?: FunctionRecord;
}

export default function RecentActivity({ fun }: RecentActivityProps) {
  const { executionEntries } = useFunction();
  const entries = (
    fun
      ? executionEntries.filter(({ function_id }) => function_id === fun.id)
      : executionEntries
  ).slice(0, 10);

  if (entries.length == 0) {
    return null;
  }
  return (
    <Stack spacing={1}>
      <Typography variant='h6'>Recent Activity</Typography>
      <TableContainer component={Paper} variant='outlined'>
        <Table size='small'>
          <TableHead>
            <TableRow>
              <TableCell>
                <strong>Time</strong>
              </TableCell>
              {fun && (
                <TableCell>
                  <strong>Code</strong>
                </TableCell>
              )}
              <TableCell>
                <strong>Query</strong>
              </TableCell>
              <TableCell>
                <strong>Result</strong>
              </TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {entries
              .slice(0, 10)
              .map(({ created_at, code, query, result }, index) => (
                <TableRow key={index}>
                  <TableCell>{formatLocalDate(created_at)}</TableCell>
                  {fun && <TableCell>{code}</TableCell>}
                  <TableCell>{query}</TableCell>
                  <TableCell>{result}</TableCell>
                </TableRow>
              ))}
          </TableBody>
        </Table>
      </TableContainer>
    </Stack>
  );
}
