'use client';

import { useEffect, useState } from 'react';
import FunctionTable from './FunctionTable';
import { Function, User } from '@/utils/types';
import Editor, { Warning } from './Editor';
import Modal from './Modal';
import * as API from '@/app/api/api';
import { isValidFunction, remove } from '@/utils/utils';
import { useSession } from 'next-auth/react';

export default function FunctionTableWrapper() {
  const session = useSession();
  const [functions, setFunctions] = useState<Function[]>([]);
  const [currentCode, setCurrentCode] = useState(
    'function add(a, b) {\n  return parseInt(a) + parseInt(b);\n}'
  );
  const [currentFunction, setCurrentFunction] = useState<Function>({
    alias: '',
    fun: '',
    total_calls: 0,
    remaining_calls: 0,
  });
  const [currentUser, setCurrentUser] = useState<User>({
    email: '',
    aliases: [],
  });
  const [modalIsOpen, setModalIsOpen] = useState(false);
  const [error, setError] = useState(false);
  const onSubmit = async () => {
    if (currentCode && isValidFunction(currentCode)) {
      const { alias } = await API.createFunction({ fun: currentCode });
      const newUser = {
        ...currentUser,
        aliases: [...currentUser.aliases, alias],
      };
      await API.updateUser(newUser);
      setCurrentUser(newUser);
      await refreshFunctions();
      setError(false);
      setModalIsOpen(false);
    } else {
      setError(true);
    }
  };
  const refreshFunctions = async () => {
    const email = session.data?.user?.email;
    if (email) {
      const { aliases } = await API.getUser({ email });
      const { functions } = await API.getFunctions({ aliases });
      setFunctions(functions);
      setCurrentUser({
        email,
        aliases,
      });
    }
  };
  const handleDeleteFunction = async (alias: string) => {
    await API.deleteFunction({ alias });
    const newUser = {
      ...currentUser,
      aliases: remove(currentUser.aliases, alias),
    };
    await API.updateUser(newUser);
    setCurrentUser(newUser);
    await refreshFunctions();
  };
  const handleUpdateFunction = async (fun: Function) => {
    await API.updateFunction(fun);
    await refreshFunctions();
  };
  useEffect(() => {
    refreshFunctions();
  }, [session]);
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
        <FunctionTable
          functions={functions}
          setFunctions={setFunctions}
          currentFunction={currentFunction}
          setCurrentFunction={setCurrentFunction}
          handleDeleteFunction={handleDeleteFunction}
          handleUpdateFunction={handleUpdateFunction}
        />
      </div>
      <Modal
        modalIsOpen={modalIsOpen}
        onClose={() => setModalIsOpen(false)}
        title='Create function'
        contents={
          <div className='space-y-4 pt-4'>
            <Editor
              code={currentCode}
              setCode={setCurrentCode}
              style={{ minHeight: '300px' }}
              error={error}
            />
            <div className='flex flex-row gap-4'>
              <button
                className='px-4 py-2 rounded-lg bg-blue-600 hover:bg-blue-700 text-center text-white'
                onClick={onSubmit}
              >
                Deploy
              </button>
            </div>
          </div>
        }
        editor
      />
    </>
  );
}
