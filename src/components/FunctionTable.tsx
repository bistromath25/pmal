'use client';

import { useCallback, useState } from 'react';
import { useFunctionContext } from '@/contexts/functionContext';
import { APP_BASE_URL } from '@/env/env';
import { Function } from '@/types/Function';
import { getDemoQuery } from '@/utils/functions';
import Editor from './Editor';
import Modal from './Modal';

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
          {functions.map((fun: Function) => {
            const url = `${fun.alias}?${getDemoQuery(fun.code, fun.language)}`;
            return (
              <tr
                className='border-b hover:bg-gray-50 align-top bg-white'
                key={`function-table-${fun.alias}`}
              >
                <td className='px-6 py-4 font-bold'>{fun.alias}</td>
                <td
                  scope='row'
                  className='px-6 py-4 whitespace-nowrap flex flex-col gap-4'
                >
                  <Editor
                    code={fun.code}
                    setCode={setCurrentCode}
                    language={fun.language}
                    style={{
                      fontSize: '16px',
                      maxHeight: '200px',
                      overflow: 'scroll',
                    }}
                    onClick={() => openEditModal(fun)}
                  />
                </td>
                <td className='px-6 py-4'>
                  <p>
                    <span className='font-bold'>{fun.total_calls}</span> total
                  </p>
                </td>
                <td className='px-6 py-4'>
                  <input
                    className='p-2 cursor-copy focus:outline-none bg-transparent border border-gray-300 rounded-lg'
                    value={url}
                    onClick={(e) => {
                      e.preventDefault();
                      navigator.clipboard.writeText(`${APP_BASE_URL}/${url}`);
                    }}
                    readOnly
                  ></input>
                </td>
                <td className='px-6 py-4 text-right'>
                  <div className='flex flex-row gap-2 text-black text-white'>
                    <button
                      className='px-4 py-2 rounded-lg bg-blue-600 hover:bg-blue-700 text-center'
                      onClick={() => openEditModal(fun)}
                    >
                      Edit
                    </button>
                    <button
                      className='px-4 py-2 rounded-lg bg-red-600 hover:bg-red-700 text-center'
                      onClick={() => openDeleteModal(fun)}
                    >
                      Delete
                    </button>
                  </div>
                </td>
              </tr>
            );
          })}
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
