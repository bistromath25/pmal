'use client';

import React, { useState } from 'react';
import CodeEditor from '@uiw/react-textarea-code-editor';
import * as API from '@/app/api/api';
import { getDemoQuery } from '@/utils/utils';
import { APP_BASE_URL } from '@/utils/env';
import { DefaultIcon, SuccessIcon } from './Icons';

function Warning() {
  return (
    <p className='w-full p-2 rounded-lg border border-red-200 bg-red-100 text-center'>
      ⚠️ Syntax error! ⚠️
    </p>
  );
}

export default function App() {
  const [code, setCode] = useState(
    `function add(a, b) {\n  return parseInt(a) + parseInt(b);\n}`
  );
  const [demoQuery, setDemoQuery] = useState<string | undefined>(undefined);
  const [error, setError] = useState(false);
  const [alias, setAlias] = useState<string | undefined>(undefined);
  const [copied, setCopied] = useState(false);
  const onSubmit = async () => {
    try {
      if (!alias) {
        const { alias } = await API.createFunction({
          fun: code,
          remaining_calls: 0,
        });
        setAlias(alias);
      } else {
        await API.updateFunction({ alias, fun: code });
      }
      setDemoQuery(getDemoQuery(code));
      setError(false);
      setCopied(false);
    } catch (e) {
      setError(true);
    }
  };
  return (
    <div className='w-full space-y-4 justify-items-center'>
      <CodeEditor
        className='w-full p-2 rounded-lg border border-blue-100 shadow-sm'
        value={code}
        language='js'
        onChange={(evn) => setCode(evn.target.value)}
        padding={15}
        style={{
          backgroundColor: '#f5f5f5',
          fontFamily:
            'ui-monospace,SFMono-Regular,SF Mono,Consolas,Liberation Mono,Menlo,monospace',
          fontSize: '18px',
          minHeight: '200px',
          overflow: 'visible',
        }}
      />
      {error && <Warning />}
      <button
        className='px-4 py-2 rounded-full border border-green-500 shadow-md bg-green-300 hover:bg-green-200 hover:border-transparent text-center disabled:cursor-not-allowed'
        onClick={onSubmit}
        disabled={!code}
      >
        {alias ? 'Update' : 'Deploy'} my function!
      </button>
      {alias && (
        <>
          <div className='flex items-center shadow-md rounded-lg'>
            <input
              className='animate-pulse bg-gray-50 border border-e-0 border-gray-300 text-gray-500 text-sm rounded-s-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 overflow-x-scroll line-clamp-1'
              style={{
                backgroundColor: '#f5f5f5',
                fontFamily:
                  'ui-monospace,SFMono-Regular,SF Mono,Consolas,Liberation Mono,Menlo,monospace',
                minWidth: '560px',
              }}
              value={`curl -X POST '${APP_BASE_URL}/api/${alias}?${demoQuery}'`}
              disabled
            />
            <button
              className='flex-shrink-0 inline-flex items-center py-3 px-4 text-sm font-medium text-center text-gray-500 bg-gray-100 border border-gray-300 rounded-e-lg focus:outline-none focus:ring-gray-100 hover:bg-gray-200 hover:text-gray-900 cursor-pointer'
              onClick={(e) => {
                e.preventDefault();
                if (alias) {
                  navigator.clipboard.writeText(
                    `curl -X POST '${APP_BASE_URL}/api/${alias}?${demoQuery}'`
                  );
                  setCopied(true);
                }
              }}
            >
              <DefaultIcon hidden={copied} />
              <SuccessIcon hidden={!copied} />
            </button>
          </div>
          <p className='text-gray-600'>
            Free functions are automatically deleted after 10 calls.{' '}
            <a href='#' className='text-blue-500'>
              Sign in
            </a>{' '}
            to get more calls!
          </p>
        </>
      )}
    </div>
  );
}
