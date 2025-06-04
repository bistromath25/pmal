'use client';

import { ReactElement } from 'react';
import CloseIcon from '@mui/icons-material/Close';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  IconButton,
  Divider,
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
        sx: { borderRadius: 2, width: editor ? '100%' : undefined },
      }}
    >
      <DialogTitle
        sx={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          pb: 1,
        }}
      >
        {title}
        <IconButton edge='end' onClick={onClose}>
          <CloseIcon />
        </IconButton>
      </DialogTitle>
      <Divider />
      <DialogContent sx={{ pt: 2 }}>{contents}</DialogContent>
      <Divider />
      <DialogContent sx={{ pt: 2 }}>{actions}</DialogContent>
    </Dialog>
  );
}
