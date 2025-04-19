import { AppBar, Box, Button, Grid, Toolbar, Typography } from '@mui/material';

export interface FooterProps {
  type: 'landing' | 'dashboard';
}

export default function Footer({ type }: FooterProps) {
  const isLanding = type === 'landing';
  return (
    <Box sx={{ backgroundColor: '#000' }}>
      <AppBar position='static'>
        <Toolbar>
          <Box>
            <Typography variant='h6'>
              Experiments with GitHub Actions as a Backend
            </Typography>
          </Box>
          <Box sx={{ flexGrow: 1 }} />
          <Grid container spacing={2}>
            <Grid>
              <Button
                href='https://github.com/bistromath25/pmal'
                color='inherit'
              >
                Contact
              </Button>
            </Grid>
            <Grid>
              <Button
                href='https://github.com/bistromath25/pmal'
                color='inherit'
              >
                Privacy
              </Button>
            </Grid>
            <Grid>
              <Button
                href='https://github.com/bistromath25/pmal'
                color='inherit'
              >
                Source
              </Button>
            </Grid>
          </Grid>
        </Toolbar>
      </AppBar>
    </Box>
  );
}
