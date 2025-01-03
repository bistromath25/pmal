'use client';

import { useCallback, useState } from 'react';
import { useFunctionContext } from '@/contexts/functionContext';
import { APP_BASE_URL } from '@/env/env';
import { Function } from '@/types/Function';
import { getDemoQuery, languageOptions } from '@/utils/functions';
import Editor from '../Editor';
import Modal from '../Modal';

const formatDate = (date: Date, full = true) =>
  full ? date.toString() : date.toString().split('T')[0];

function FunctionDetails({ fun }: { fun: Function }) {
  return (
    <>
      <div className='hidden md:flex md:flex-row gap-10'>
        <div className='flex flex-row gap-2'>
          <div>
            <p className='font-bold'>Total calls:</p>
            <p className='font-bold'>Language:</p>
          </div>
          <div>
            <p>{fun.total_calls}</p>
            <p>{fun.language}</p>
          </div>
        </div>
        <div className='flex flex-row gap-2'>
          <div>
            <p className='font-bold'>Created at:</p>
            <p className='font-bold'>Updated at:</p>
          </div>
          <div>
            <p>{formatDate(fun.created_at)}</p>
            <p>{formatDate(fun.updated_at ?? fun.created_at)}</p>
          </div>
        </div>
      </div>
      <div className='md:hidden'>
        <p className='font-bold'>Total calls: {fun.total_calls}</p>
        <p className='font-bold'>Language: {fun.language}</p>
        <p className='font-bold'>Created at: {formatDate(fun.created_at)}</p>
        <p className='font-bold'>
          Updated at: {formatDate(fun.updated_at ?? fun.created_at)}
        </p>
      </div>
    </>
  );
}

export interface FunctionTableProps {
  handleDeleteFunction: (alias: string) => Promise<void>;
  handleUpdateFunction: (fun: Function) => Promise<void>;
}

export default function FunctionTable({
  handleDeleteFunction,
  handleUpdateFunction,
}: FunctionTableProps) {
  const {
    code: currentCode,
    setCode: setCurrentCode,
    currentFunction,
    setCurrentFunction,
    functions,
  } = useFunctionContext();
  const [deleteModalIsOpen, setDeleteModalIsOpen] = useState(false);
  const [editModalIsOpen, setEditModalIsOpen] = useState(false);
  const [error, setError] = useState(false);
  const openEditModal = useCallback(
    (fun: Function) => {
      setCurrentCode(fun.code);
      setCurrentFunction(fun);
      setEditModalIsOpen(true);
    },
    [setCurrentCode, setCurrentFunction, setEditModalIsOpen]
  );
  const openDeleteModal = useCallback(
    (fun: Function) => {
      setCurrentFunction(fun);
      setDeleteModalIsOpen(true);
    },
    [setCurrentFunction, setDeleteModalIsOpen]
  );
  return functions && functions.length ? (
    <div className='pl-4 pr-4'>
      <div className='relative overflow-x-auto grid grid-cols-2 md:grid-cols-3 gap-10'>
        {functions.map((fun: Function) => {
          const logo = languageOptions.find(
            ({ name }) => name === fun.language
          )?.logoUrl;
          const createdAtDateString = formatDate(fun.created_at, false);
          return (
            <div
              className='bg-gray-100 border border-gray-300 shadow-md rounded-lg p-1 md:p-4'
              key={`function-box-${fun.alias}`}
            >
              <div className='flex flex-col md:flex-row p-1 md:p-0 md:space-x-4'>
                <div className='hidden md:inline-block basis-1/6 my-auto'>
                  <img className='h-[50px]' src={logo} />
                </div>
                <div className='basis-2/3'>
                  <p className='font-bold text-2xl'>{fun.alias}</p>
                  <p>Calls: {fun.total_calls}</p>
                  <p>Created: {createdAtDateString}</p>
                </div>
                <div className='basis-1/6 my-auto flex flex-col space-y-2'>
                  <button
                    className='px-4 py-2 rounded-lg bg-blue-600 hover:bg-blue-700 text-center text-white'
                    onClick={() => openEditModal(fun)}
                  >
                    Edit
                  </button>
                  <button
                    className='px-4 py-2 rounded-lg bg-red-600 hover:bg-red-700 text-center text-white'
                    onClick={() => openDeleteModal(fun)}
                  >
                    Delete
                  </button>
                </div>
              </div>
            </div>
          );
        })}
      </div>
      <Modal
        modalIsOpen={deleteModalIsOpen}
        onClose={() => setDeleteModalIsOpen(false)}
        title={`Delete function ${currentFunction.alias}?`}
        contents={
          <div className='space-y-4 justify-items-center'>
            <p className='text-gray-600'>
              Are you sure you want to delete this function? This action cannot
              be undone.
            </p>
            <div className='flex flex-row gap-4'>
              <button
                className='px-4 py-2 rounded-lg bg-red-600 hover:bg-red-700 text-center text-white'
                onClick={() => {
                  handleDeleteFunction(currentFunction.alias);
                  setDeleteModalIsOpen(false);
                }}
              >
                Yes, I'm sure
              </button>
              <button
                className='px-4 py-2 rounded-lg bg-white hover:bg-gray-100 border border-gray-300 text-center text-black'
                onClick={() => setDeleteModalIsOpen(false)}
              >
                No, Cancel
              </button>
            </div>
          </div>
        }
      />
      <Modal
        modalIsOpen={editModalIsOpen}
        onClose={() => setEditModalIsOpen(false)}
        title={`Edit function ${currentFunction.alias}`}
        contents={
          <div className='space-y-4 pt-2'>
            <div>
              <FunctionDetails fun={currentFunction} />
              <div className='flex flex-row gap-2 pt-2'>
                <p className='font-bold my-auto'>URL:</p>
                <input
                  className='w-full px-1 cursor-copy focus:outline-none bg-transparent border border-gray-300 rounded-lg'
                  value={`${currentFunction.alias}?${getDemoQuery(currentFunction.code, currentFunction.language)}`}
                  onClick={(e) => {
                    e.preventDefault();
                    navigator.clipboard.writeText(
                      `${APP_BASE_URL}/api/${currentFunction.alias}?${getDemoQuery(currentFunction.code, currentFunction.language)}`
                    );
                  }}
                  readOnly
                />
              </div>
            </div>
            <Editor
              code={currentCode}
              setCode={setCurrentCode}
              language={currentFunction.language}
              style={{ minHeight: '300px' }}
              error={error}
              setError={setError}
            />
            <div className='flex flex-row gap-4'>
              <button
                className='px-4 py-2 rounded-lg bg-blue-600 hover:bg-blue-700 text-center text-white disabled:hover:cursor-not-allowed'
                onClick={() => {
                  const newFunction = {
                    ...currentFunction,
                    code: currentCode,
                  };
                  setCurrentFunction(newFunction);
                  handleUpdateFunction(newFunction);
                  setEditModalIsOpen(false);
                }}
                disabled={error || !currentCode}
              >
                Save
              </button>
            </div>
          </div>
        }
        editor
      />
    </div>
  ) : null;
}
