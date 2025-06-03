import { useRouter } from 'next/navigation';
import { useFunction } from '@/contexts/function';
import { FunctionRecord } from '@/types';
import Modal, { ModalProps } from './Modal';
import { Button, Stack, Typography } from '@mui/material';

interface DeleteModalProps extends ModalProps {
  fun: FunctionRecord | null;
}

export default function DeleteModal({
  modalIsOpen,
  onClose,
  fun,
}: DeleteModalProps) {
  const router = useRouter();
  const { setCurrentFunction, deleteFunction } = useFunction();

  const handleDelete = async () => {
    if (!fun?.id) {
      return;
    }
    await deleteFunction(fun.id);
    router.push('/functions');
  };

  return (
    <Modal
      modalIsOpen={modalIsOpen}
      onClose={onClose}
      title={`Delete function ${fun?.alias}?`}
      contents={
        <Typography variant='body1' color='text.secondary'>
          Are you sure you want to delete this function? This action cannot be
          undone.
        </Typography>
      }
      actions={
        <Stack
          flexDirection='row'
          sx={{ justifyContent: 'flex-end', display: 'flex', gap: 2 }}
        >
          <Button
            variant='outlined'
            onClick={() => {
              setCurrentFunction(null);
              onClose();
            }}
          >
            No, Cancel
          </Button>
          <Button
            variant='contained'
            color='error'
            onClick={() => {
              handleDelete();
              onClose();
            }}
          >
            Yes, I'm sure
          </Button>
        </Stack>
      }
    />
  );
}
