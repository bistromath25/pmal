import Header from '@/components/Header';
import { Box } from '@mui/material';

export default function layout({ children }: { children: React.ReactNode }) {
  return (
    <Box sx={{ width: '100%' }}>
      <Header type='landing' />
      <Box sx={{ maxWidth: '400px', mx: 'auto' }}>{children}</Box>
    </Box>
  );
}
