'use client';

import { useCallback, useEffect, useState } from 'react';
import { useSession } from 'next-auth/react';
import * as API from '@/app/api/api';
import { useUserContext } from '@/contexts/userContext';
import { Function } from '@/types/types';
import { getDefaultFunctionValue, isValidFunction } from '@/utils/functions';
import { remove } from '@/utils/utils';
import Editor from './Editor';
import { LanguageSelection } from './EditorPlayground';
import FunctionTable from './FunctionTable';
import Modal from './Modal';

export default function FunctionTableWrapper() {
  const session = useSession();
  const { user: currentUser, setUser: setCurrentUser } = useUserContext();
  const [functions, setFunctions] = useState<Function[]>([]);
  const [currentCode, setCurrentCode] = useState(getDefaultFunctionValue('js'));
  const [currentLanguage, setCurrentLanguage] = useState('js');
  const [currentFunction, setCurrentFunction] = useState<Function>({
    alias: '',
    code: '',
    total_calls: 0,
    remaining_calls: 0,
    language: 'js',
  });
  const [modalIsOpen, setModalIsOpen] = useState(false);
  const [error, setError] = useState(false);
  const onSubmit = async () => {
    if (isValidFunction(currentCode, currentLanguage)) {
      const {
        fun: { alias },
      } = await API.createFunction({
        code: currentCode,
        language: currentLanguage,
      });
      const { user } = await API.updateUser({
        ...currentUser,
        aliases: [...currentUser.aliases, alias],
      });
      setCurrentUser(user);
      await refreshFunctions();
      setError(false);
      setModalIsOpen(false);
    } else {
      setError(true);
    }
  };
  const refreshFunctions = useCallback(async () => {
    const email = session.data?.user?.email;
    if (email) {
      const {
        user: { aliases, key },
      } = await API.getUser({ email });
      const { funs } = await API.getFunctions({ aliases });
      setFunctions(funs);
      setCurrentUser({ email, aliases, key });
    }
  }, [session, setCurrentUser]);
  const handleDeleteFunction = useCallback(
    async (alias: string) => {
      await API.deleteFunction({ alias });
      const { user } = await API.updateUser({
        ...currentUser,
        aliases: remove(currentUser.aliases, alias),
      });
      setCurrentUser(user);
      await refreshFunctions();
    },
    [currentUser, setCurrentUser, refreshFunctions]
  );
  const handleUpdateFunction = useCallback(
    async (fun: Function) => {
      await API.updateFunction(fun);
      await refreshFunctions();
    },
    [refreshFunctions]
  );
  useEffect(() => {
    refreshFunctions();
  }, [session, refreshFunctions]);
  useEffect(() => {
    setCurrentCode(getDefaultFunctionValue(currentLanguage));
  }, [currentLanguage, setCurrentCode]);
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
            <LanguageSelection
              type='dashboard'
              currentLanguage={currentLanguage}
              setCurrentLanguage={setCurrentLanguage}
            />
            <Editor
              code={currentCode}
              setCode={setCurrentCode}
              language={currentLanguage}
              style={{ minHeight: '300px' }}
              error={error}
              setError={setError}
            />
            <div className='flex flex-row gap-4'>
              <button
                className='px-4 py-2 rounded-lg bg-blue-600 hover:bg-blue-700 text-center text-white disabled:hover:cursor-not-allowed'
                onClick={onSubmit}
                disabled={error || !currentCode}
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
