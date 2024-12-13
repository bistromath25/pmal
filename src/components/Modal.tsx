import { ReactElement } from 'react';
import { CloseModalIcon } from './Icons';

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
      <div className='backdrop-blur-sm justify-center items-center text-left flex overflow-x-hidden overflow-y-auto fixed inset-0 z-40 outline-none focus:outline-none'>
        <div
          className={`bg-white rounded-lg shadow z-50 p-0 ${editor ? 'w-[70%]' : 'w-[500px]'}`}
        >
          <div className='space-y-2 p-6'>
            <div className='flex items-center justify-between rounded-t'>
              <h1 className='text-xl font-bold leading-tight tracking-tight text-gray-900 md:text-2xl'>
                {title}
              </h1>
              <button
                type='button'
                className='text-gray-400 bg-transparent hover:bg-gray-200 hover:text-gray-900 rounded-lg text-sm w-8 h-8 ms-auto inline-flex justify-center items-center'
                data-modal-hide='static-modal'
                onClick={onClose}
              >
                <CloseModalIcon />
              </button>
            </div>
            <hr className='h-px bg-gray-50 border-1' />
            {contents}
          </div>
        </div>
      </div>
      <div className='opacity-25 fixed inset-0 z-30 bg-black' />
    </>
  ) : null;
}
