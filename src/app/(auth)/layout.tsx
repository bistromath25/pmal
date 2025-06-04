import Footer from '@/components/Footer';
import Header from '@/components/Header';
import { HEADER_HEIGHT } from '@/utils';
import { Box } from '@mui/material';

export default function layout({ children }: { children: React.ReactNode }) {
  return (
    <Box
      sx={{
        display: 'flex',
        flexDirection: 'column',
        minHeight: '100vh',
        width: '100%',
        backgroundColor: 'background.paper',
      }}
    >
      <Box sx={{ flexShrink: 0 }}>
        <Header />
      </Box>
      <Box
        sx={{
          flexGrow: 1,
          mx: 'auto',
          my: `${HEADER_HEIGHT * 2}px`,
          justifyContent: 'center',
        }}
      >
        {children}
      </Box>
      <Box sx={{ flexShrink: 0 }}>
        <Footer />
      </Box>
    </Box>
  );
}
