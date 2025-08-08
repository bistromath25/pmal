import { useFunction } from '@/contexts/function';
import { FunctionRecord } from '@/types';
import { formatRelativeDate } from '@/utils';
import {
  Box,
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
  const { executionEntries, functions } = useFunction();
  const entries = (
    fun
      ? executionEntries.filter(({ function_id }) => function_id === fun.id)
      : executionEntries
  ).slice(0, 10);

  if (entries.length === 0) {
    return null;
  }

  const aliasMap = new Map(functions.map((f) => [f.id, f.alias]));

  const headerCell = {
    color: '#64748b',
    fontWeight: 600,
    fontSize: '0.75rem',
    textTransform: 'uppercase' as const,
    letterSpacing: '0.06em',
    borderBottom: '1px solid #e2e8f0',
  };

  return (
    <Stack spacing={1.5}>
      <Typography
        variant='overline'
        sx={{ color: '#94a3b8', fontWeight: 700, letterSpacing: '0.1em' }}
      >
        Recent Activity
      </Typography>
      <Box
        sx={{
          background: '#fff',
          border: '1px solid #e2e8f0',
          borderRadius: '12px',
          overflow: 'hidden',
        }}
      >
        <TableContainer>
          <Table size='small'>
            <TableHead>
              <TableRow sx={{ background: '#f8fafc' }}>
                <TableCell sx={headerCell}>Time</TableCell>
                {!fun && <TableCell sx={headerCell}>Function</TableCell>}
                {fun && <TableCell sx={headerCell}>Code</TableCell>}
                <TableCell sx={headerCell}>Query</TableCell>
                <TableCell sx={headerCell}>Result</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {entries.map(
                ({ created_at, function_id, code, query, result }, index) => (
                  <TableRow
                    key={index}
                    sx={{
                      '&:last-child td': { border: 0 },
                      '&:hover': { background: '#f8fafc' },
                    }}
                  >
                    <TableCell
                      sx={{
                        color: '#64748b',
                        fontSize: '0.8rem',
                        fontFamily: 'monospace',
                      }}
                    >
                      {formatRelativeDate(created_at)}
                    </TableCell>
                    {!fun && (
                      <TableCell
                        sx={{
                          color: '#0f172a',
                          fontSize: '0.8rem',
                          fontFamily: 'monospace',
                          fontWeight: 600,
                        }}
                      >
                        {aliasMap.get(function_id) ?? function_id.slice(0, 6)}
                      </TableCell>
                    )}
                    {fun && (
                      <TableCell
                        sx={{
                          color: '#334155',
                          fontSize: '0.8rem',
                          fontFamily: 'monospace',
                          maxWidth: 200,
                          overflow: 'hidden',
                          textOverflow: 'ellipsis',
                          whiteSpace: 'nowrap',
                        }}
                      >
                        {code}
                      </TableCell>
                    )}
                    <TableCell
                      sx={{
                        color: '#334155',
                        fontSize: '0.8rem',
                        fontFamily: 'monospace',
                      }}
                    >
                      {query}
                    </TableCell>
                    <TableCell
                      sx={{
                        color: '#334155',
                        fontSize: '0.8rem',
                        fontFamily: 'monospace',
                      }}
                    >
                      {result}
                    </TableCell>
                  </TableRow>
                )
              )}
            </TableBody>
          </Table>
        </TableContainer>
      </Box>
    </Stack>
  );
}
