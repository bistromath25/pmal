'use client';

import { useState } from 'react';
import { HEADER_HEIGHT } from '@/utils';
import LockOutlinedIcon from '@mui/icons-material/LockOutlined';
import {
  Alert,
  Avatar,
  Button,
  Paper,
  Stack,
  TextField,
  Typography,
} from '@mui/material';

export default function AuthForm({
  mode,
  onSubmit,
}: {
  mode: 'signin' | 'signup';
  onSubmit: (data: {
    email: string;
    password: string;
    confirm?: string;
  }) => Promise<void>;
}) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirm, setConfirm] = useState('');
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async () => {
    if (
      !email.trim() ||
      !password.trim() ||
      (mode === 'signup' && !confirm.trim())
    ) {
      setError('Please fill in all required fields.');
      return;
    }

    if (mode === 'signup' && password !== confirm) {
      setError('Passwords do not match.');
      return;
    }

    setError(null);

    try {
      await onSubmit({ email, password, confirm });
    } catch {
      setError('Failed to authenticate. Please try again.');
    }
  };

  return (
    <Paper
      elevation={3}
      sx={{ padding: 4, mt: `${HEADER_HEIGHT * 1.75}px`, borderRadius: 3 }}
    >
      <Stack spacing={2} alignItems='center'>
        <Avatar
          sx={{
            bgcolor: mode === 'signup' ? 'secondary.main' : 'primary.main',
          }}
        >
          <LockOutlinedIcon />
        </Avatar>

        <Typography component='h1' variant='h5'>
          {mode === 'signup' ? 'Sign up' : 'Sign in'}
        </Typography>

        <Stack spacing={2} sx={{ width: '100%' }}>
          <TextField
            label='Email Address'
            fullWidth
            required
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            autoComplete='email'
            autoFocus
          />
          <TextField
            label='Password'
            type='password'
            fullWidth
            required
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            autoComplete={
              mode === 'signup' ? 'new-password' : 'current-password'
            }
          />
          {mode === 'signup' && (
            <TextField
              label='Confirm Password'
              type='password'
              fullWidth
              required
              value={confirm}
              onChange={(e) => setConfirm(e.target.value)}
              autoComplete='new-password'
            />
          )}

          {error && (
            <Alert severity='warning' sx={{ mb: 2 }}>
              {error}
            </Alert>
          )}

          <Button variant='contained' fullWidth onClick={handleSubmit}>
            {mode === 'signup' ? 'Sign Up' : 'Sign In'}
          </Button>
        </Stack>
      </Stack>
    </Paper>
  );
}
