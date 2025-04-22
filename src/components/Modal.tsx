import { ReactElement } from 'react';
import { CloseModalIcon } from './Icons';
import { Box, Button, Divider, Typography } from '@mui/material';

export interface ModalProps {
  modalIsOpen: boolean;
  onClose: () => void;
  title?: string;
  contents?: ReactElement;
  editor?: boolean;
}

export default function Modal({
  modalIsOpen,
  onClose,
  title,
  contents,
  editor,
}: ModalProps) {
  return modalIsOpen ? (
    <>
      <Box
        sx={{ zIndex: 1300 }}
        className='backdrop-blur-sm justify-center items-center text-left flex overflow-x-hidden overflow-y-auto fixed inset-0 z-40 outline-none focus:outline-none'
      >
        <Box
          className={`bg-white rounded-lg shadow z-50 p-0 ${editor ? 'w-[100%] md:w-[70%]' : 'w-[500px]'}`}
        >
          <Box className='space-y-2 p-6'>
            <Box className='flex items-center justify-between rounded-t'>
              <Typography
                variant='h5'
                className='text-xl font-bold leading-tight tracking-tight text-gray-900 md:text-2xl'
              >
                {title}
              </Typography>
              <Button data-modal-hide='static-modal' onClick={onClose}>
                <CloseModalIcon />
              </Button>
            </Box>
            <Divider />
            {contents}
          </Box>
        </Box>
      </Box>
      <Box className='opacity-25 fixed inset-0 z-30 bg-black' />
    </>
  ) : null;
}
