'use client';

import { useCallback, useState } from 'react';
import { APP_BASE_URL } from '@/env/env';
import { Function } from '@/types/types';
import { getDemoQuery } from '@/utils/functions';
import Editor from './Editor';
import Modal from './Modal';

export interface FunctionTableProps {
  functions: Function[];
  setFunctions: React.Dispatch<React.SetStateAction<Function[]>>;
  currentFunction: Function;
  setCurrentFunction: React.Dispatch<React.SetStateAction<Function>>;
  handleDeleteFunction: (alias: string) => Promise<void>;
  handleUpdateFunction: (fun: Function) => Promise<void>;
}

export default function FunctionTable({
  functions,
  setFunctions,
  currentFunction,
  setCurrentFunction,
  handleDeleteFunction,
  handleUpdateFunction,
}: FunctionTableProps) {
  const [currentCode, setCurrentCode] = useState('');
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
    <div className='relative overflow-x-auto'>
      <table className='w-full text-md text-left rtl:text-right text-gray-500'>
        <thead className='text-md text-gray-700 uppercase bg-gray-50 border border-gray-300 border-s-0 border-e-0'>
          <tr>
            <th scope='col' className='px-6 py-3'>
              Alias
            </th>
            <th scope='col' className='px-6 py-3'>
              Function
            </th>
            <th scope='col' className='px-6 py-3'>
              Calls
            </th>
            <th scope='col' className='px-6 py-3'>
              Url
            </th>
            <th scope='col' className='px-6 py-3'>
              <span className='sr-only'>Edit</span>
            </th>
          </tr>
        </thead>
        <tbody>
          {functions.map(
            ({ code, alias, total_calls, remaining_calls, language }) => {
              return (
                <tr
                  className='border-b hover:bg-gray-50 align-top bg-white'
                  key={`function-table-${alias}`}
                >
                  <td className='px-6 py-4 font-bold'>{alias}</td>
                  <td
                    scope='row'
                    className='px-6 py-4 whitespace-nowrap flex flex-col gap-4'
                  >
                    <Editor
                      code={code}
                      setCode={setCurrentCode}
                      language={language}
                      style={{
                        fontSize: '16px',
                        maxHeight: '200px',
                        overflow: 'scroll',
                      }}
                      onClick={() =>
                        openEditModal({
                          code,
                          alias,
                          total_calls,
                          remaining_calls,
                          language,
                        })
                      }
                    />
                  </td>
                  <td className='px-6 py-4'>
                    <p>
                      <span className='font-bold'>{total_calls}</span> total
                    </p>
                  </td>
                  <td className='px-6 py-4'>
                    <input
                      className='p-2 cursor-copy focus:outline-none bg-transparent border border-gray-300 rounded-lg'
                      value={`/${alias}?${getDemoQuery(code, language)}`}
                      onClick={(e) => {
                        e.preventDefault();
                        navigator.clipboard.writeText(
                          `${APP_BASE_URL}/api/${alias}?${getDemoQuery(code, language)}`
                        );
                      }}
                      readOnly
                    ></input>
                  </td>
                  <td className='px-6 py-4 text-right'>
                    <div className='flex flex-row gap-2 text-black text-white'>
                      <button
                        className='px-4 py-2 rounded-lg bg-blue-600 hover:bg-blue-700 text-center'
                        onClick={() =>
                          openEditModal({
                            code,
                            alias,
                            total_calls,
                            remaining_calls,
                            language,
                          })
                        }
                      >
                        Edit
                      </button>
                      <button
                        className='px-4 py-2 rounded-lg bg-red-600 hover:bg-red-700 text-center'
                        onClick={() =>
                          openDeleteModal({
                            code,
                            alias,
                            total_calls,
                            remaining_calls,
                            language,
                          })
                        }
                      >
                        Delete
                      </button>
                    </div>
                  </td>
                </tr>
              );
            }
          )}
        </tbody>
      </table>
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
          <div className='space-y-4 pt-4'>
            <Editor
              code={currentCode}
              setCode={setCurrentCode}
              language='js'
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
