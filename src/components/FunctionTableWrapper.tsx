'use client';

import { useState } from 'react';
import FunctionTable from './FunctionTable';
import { Function } from '@/utils/types';
import Editor from './Editor';
import Modal from './Modal';
import * as API from '@/app/api/api';

export default function FunctionTableWrapper() {
  const [functions, setFunctions] = useState<Function[]>([]);
  const [code, setCode] = useState(
    'function add(a, b) {\n  return parseInt(a) + parseInt(b);\n}'
  );
  const [modalIsOpen, setModalIsOpen] = useState(false);
  const [error, setError] = useState(false);
  const onSubmit = async () => {
    try {
      if (code) {
        const { alias } = await API.createFunction({ fun: code });
      }
      setError(false);
    } catch (error) {
      setError(true);
    }
  };
  return (
    <>
      <div className='w-full space-y-10'>
        <div className='justify-items-left pl-4 space-y-4'>
          <h1 className='text-4xl font-bold'>Functions</h1>
          <button
            className='px-4 py-2 rounded-lg bg-blue-600 hover:bg-blue-700 text-center text-white'
            onClick={() => setModalIsOpen(true)}
          >
            Create
          </button>
        </div>
        <FunctionTable functions={functions} setFunctions={setFunctions} />
      </div>
      <Modal
        modalIsOpen={modalIsOpen}
        onClose={() => setModalIsOpen(false)}
        title='Create function'
        contents={
          <div className='space-y-4 pt-4'>
            <Editor
              code={code}
              setCode={setCode}
              style={{ minHeight: '300px' }}
            />
            <div className='flex flex-row gap-4'>
              <button
                className='px-4 py-2 rounded-lg bg-blue-600 hover:bg-blue-700 text-center text-white'
                onClick={() => {
                  onSubmit();
                  setModalIsOpen(false);
                }}
              >
                Deploy
              </button>
            </div>
          </div>
        }
        width='80%'
      />
    </>
  );
}
