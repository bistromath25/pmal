'use client';

import { useState } from 'react';
import NextLink from 'next/link';
import {
  isValidEmail,
  passwordContainsSpaces,
  validPasswordLength,
} from '@/utils';
import LockOutlinedIcon from '@mui/icons-material/LockOutlined';
import {
  Alert,
  Avatar,
  Box,
  Button,
  Link,
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

    if (!validPasswordLength(password) || passwordContainsSpaces(password)) {
      setError('Password must be at least 8 characters without spaces.');
    }

    setError(null);
    try {
      await onSubmit({ email, password, confirm });
    } catch {
      setError('Incorrect email or password.');
    }
  };

  return (
    <Paper
      elevation={3}
      sx={{
        padding: 4,
        borderRadius: 3,
        width: '400px',
        backgroundColor: 'background.default',
      }}
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
            type='email'
            fullWidth
            required
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            autoComplete='email'
            autoFocus
            error={
              mode === 'signup' && email.length > 0 && !isValidEmail(email)
            }
            helperText={
              mode === 'signup' && email.length > 0 && !isValidEmail(email)
                ? 'Please enter a valid email address.'
                : ''
            }
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
            error={
              mode === 'signup' &&
              password.length > 0 &&
              (validPasswordLength(password) ||
                passwordContainsSpaces(password))
            }
            helperText={
              mode === 'signup' && password.length > 0
                ? !validPasswordLength(password)
                  ? 'Password must be at least 8 characters.'
                  : passwordContainsSpaces(password)
                    ? 'Password must not contain spaces.'
                    : ''
                : ''
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
          <Box textAlign='center' mt={2}>
            <Link
              component={NextLink}
              href={mode === 'signup' ? '/signin' : '/signup'}
              color='primary.main'
              underline='hover'
            >
              {mode === 'signup'
                ? 'Already have an account? Sign in'
                : "Don't have an account? Sign up"}
            </Link>
          </Box>
        </Stack>
      </Stack>
    </Paper>
  );
}
