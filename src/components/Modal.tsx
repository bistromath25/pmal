'use client';

import { ReactElement } from 'react';
import CloseIcon from '@mui/icons-material/Close';
import {
  Box,
  Dialog,
  DialogContent,
  DialogTitle,
  IconButton,
  Typography,
  useMediaQuery,
  useTheme,
} from '@mui/material';

export interface ModalProps {
  modalIsOpen: boolean;
  onClose: () => void;
  title?: string;
  contents?: ReactElement;
  actions?: ReactElement;
  editor?: boolean;
}

export default function Modal({
  modalIsOpen,
  onClose,
  title,
  contents,
  actions,
  editor,
}: ModalProps) {
  const theme = useTheme();
  const fullScreen = useMediaQuery(theme.breakpoints.down('md'));

  return (
    <Dialog
      open={modalIsOpen}
      onClose={onClose}
      fullWidth
      fullScreen={editor && fullScreen}
      maxWidth={editor ? 'md' : 'sm'}
      PaperProps={{
        sx: {
          borderRadius: '16px',
          background: '#fff',
          border: '1px solid #e2e8f0',
          boxShadow: '0 20px 60px rgba(0,0,0,0.12)',
          width: editor ? '100%' : undefined,
        },
      }}
    >
      <DialogTitle
        sx={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          px: 3,
          py: 2,
          borderBottom: '1px solid #f1f5f9',
        }}
      >
        <Typography
          component='span'
          sx={{
            fontWeight: 700,
            color: '#0f172a',
            letterSpacing: '-0.01em',
            fontSize: '1.1rem',
          }}
        >
          {title}
        </Typography>
        <IconButton
          edge='end'
          onClick={onClose}
          size='small'
          sx={{
            color: '#94a3b8',
            '&:hover': { color: '#0f172a', background: 'rgba(0,0,0,0.05)' },
          }}
        >
          <CloseIcon fontSize='small' />
        </IconButton>
      </DialogTitle>

      <DialogContent sx={{ px: 3, pt: '20px !important', pb: 2.5 }}>
        {contents}
      </DialogContent>

      {actions && (
        <Box
          sx={{
            px: 3,
            py: 2,
            borderTop: '1px solid #f1f5f9',
            display: 'flex',
            justifyContent: 'flex-end',
          }}
        >
          {actions}
        </Box>
      )}
    </Dialog>
  );
}
