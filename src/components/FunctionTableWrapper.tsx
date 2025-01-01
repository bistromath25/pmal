'use client';

import { useCallback, useEffect, useState } from 'react';
import * as API from '@/app/api/api';
import { useFunctionContext } from '@/contexts/functionContext';
import { useUserContext } from '@/contexts/userContext';
import { Function } from '@/types/types';
import { getDefaultFunctionValue, isValidFunction } from '@/utils/functions';
import { remove } from '@/utils/utils';
import Editor from './Editor';
import { LanguageSelection } from './EditorPlayground';
import FunctionTable from './FunctionTable';
import Modal from './Modal';

export default function FunctionTableWrapper() {
  const { user: currentUser, setUser: setCurrentUser } = useUserContext();
  const {
    code: currentCode,
    setCode: setCurrentCode,
    language: currentLanguage,
    setLanguage: setCurrentLanguage,
    setFunctions,
  } = useFunctionContext();
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
    const { email, aliases, key } = currentUser;
    const { funs } = await API.getFunctions({ aliases });
    setFunctions(funs);
    setCurrentUser({ email, aliases, key });
  }, [currentUser, setCurrentUser, setFunctions]);
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
