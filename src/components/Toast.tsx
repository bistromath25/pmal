import { Alert, Snackbar, Typography } from '@mui/material';

interface ToastProps {
  open: boolean;
  onClose: () => void;
  type: 'success' | 'error';
  message: string;
}

export default function Toast({ open, onClose, type, message }: ToastProps) {
  return (
    <Snackbar
      anchorOrigin={{ vertical: 'top', horizontal: 'center' }}
      open={open}
      onClose={onClose}
    >
      <Alert
        onClose={onClose}
        severity={type}
        variant='filled'
        sx={{ width: '100%' }}
      >
        <Typography variant='body1'>{message}</Typography>
      </Alert>
    </Snackbar>
  );
}
