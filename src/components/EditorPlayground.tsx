'use client';

import { useState } from 'react';
import Editor, { EditorProps } from './Editor';
import { User } from '@/utils/types';
import {
  defaultFunctionValue,
  getDemoQuery,
  isValidFunction,
} from '@/utils/utils';
import * as API from '@/app/api/api';
import { APP_BASE_URL } from '@/utils/env';
import { DefaultIcon, SuccessIcon } from './Icons';

export interface EditorPlaygroundProps extends EditorProps {
  currentUser: User;
}

export default function EditorPlayground({
  code,
  setCode,
  onClick,
  style,
  currentUser,
}: EditorPlaygroundProps) {
  const [error, setError] = useState(false);
  const [demoQuery, setDemoQuery] = useState(getDemoQuery(code));
  const [copied, setCopied] = useState(false);
  const onSubmit = async () => {
    if (code && isValidFunction(code)) {
      await API.updateFunction({ alias: currentUser.key, fun: code });
      setDemoQuery(getDemoQuery(code));
      setError(false);
    } else {
      setError(true);
    }
  };
  return (
    <div className='w-full flex flex-row space-x-10'>
      <div className='basis-[70%] space-y-4'>
        <Editor code={code} setCode={setCode} style={style} error={error} />
        <div className='space-x-4'>
          <button
            className='px-4 py-2 rounded-lg bg-green-600 hover:bg-green-700 text-center text-white'
            onClick={onSubmit}
          >
            Deploy
          </button>
          <button
            className='px-4 py-2 rounded-lg bg-red-600 hover:bg-red-700 text-center text-white'
            onClick={() => setCode(defaultFunctionValue)}
          >
            Reset
          </button>
        </div>
        <div className='flex items-center shadow-md rounded-lg'>
          <input
            className='animate-pulse bg-gray-50 border border-e-0 border-gray-300 text-gray-500 text-sm rounded-s-lg block w-full p-2.5 overflow-x-scroll line-clamp-1 focus:outline-none'
            value={`curl -X POST '${APP_BASE_URL}/api/${currentUser.key}?${demoQuery}'`}
            readOnly
          />
          <button
            className='flex-shrink-0 inline-flex items-center py-3 px-4 text-sm font-medium text-center text-gray-500 bg-gray-100 border border-gray-300 rounded-e-lg focus:outline-none focus:ring-gray-100 hover:bg-gray-200 hover:text-gray-900 cursor-pointer'
            onClick={(e) => {
              e.preventDefault();
              navigator.clipboard.writeText(
                `curl -X POST '${APP_BASE_URL}/api/${currentUser.key}?${demoQuery}'`
              );
              setCopied(true);
            }}
          >
            <DefaultIcon hidden={copied} />
            <SuccessIcon hidden={!copied} />
          </button>
        </div>
      </div>
      <div className='basis-[30%] space-y-4'>
        <div className='space-x-4'>Hold</div>
      </div>
    </div>
  );
}

// get api key from first 8 chars of UUID
// use api key to create a special function
// for the playground
