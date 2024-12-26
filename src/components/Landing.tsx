'use client';

import { useState } from 'react';
import * as API from '@/app/api/api';
import { APP_BASE_URL } from '@/env/env';
import {
  getDefaultAsyncFunctionValue,
  getDefaultFunctionValue,
  isValidFunction,
} from '@/utils/functions';
import { getDemoQuery } from '@/utils/functions';
import Editor, { ViewOnlyEditor } from './Editor';
import Footer from './Footer';
import Header from './Header';
import { DefaultIcon, SuccessIcon } from './Icons';

function LandingEditor() {
  const [code, setCode] = useState(getDefaultFunctionValue('js'));
  const [demoQuery, setDemoQuery] = useState<string | undefined>(undefined);
  const [error, setError] = useState(false);
  const [alias, setAlias] = useState<string | undefined>(undefined);
  const [copied, setCopied] = useState(false);
  const onSubmit = async () => {
    if (isValidFunction(code, 'js')) {
      const {
        fun: { alias },
      } = await API.createFunction({
        code,
        anonymous: true,
      });
      setAlias(alias);
      setDemoQuery(getDemoQuery(code, 'js'));
      setCopied(false);
      setError(false);
    } else {
      setError(true);
    }
  };
  return (
    <div className='w-full space-y-4 justify-items-center'>
      <Editor code={code} setCode={setCode} error={error} />
      <button
        className='px-4 py-2 rounded-full border border-green-500 shadow-md bg-green-300 hover:bg-green-400 hover:border-transparent text-center disabled:cursor-not-allowed font-bold'
        onClick={onSubmit}
        disabled={!code}
      >
        Deploy my function!
      </button>
      {alias && (
        <>
          <div className='flex items-center shadow-md rounded-lg'>
            <input
              className='animate-pulse bg-gray-50 border border-e-0 border-gray-300 text-gray-500 text-sm rounded-s-lg block w-full p-2.5 overflow-x-scroll line-clamp-1 focus:outline-none'
              style={{
                backgroundColor: '#f5f5f5',
                fontFamily:
                  'ui-monospace,SFMono-Regular,SF Mono,Consolas,Liberation Mono,Menlo,monospace',
                minWidth: '560px',
              }}
              value={`curl -X GET '${APP_BASE_URL}/api/${alias}?${demoQuery}'`}
              readOnly
            />
            <button
              className='flex-shrink-0 inline-flex items-center py-3 px-4 text-sm font-medium text-center text-gray-500 bg-gray-100 border border-gray-300 rounded-e-lg focus:outline-none focus:ring-gray-100 hover:bg-gray-200 hover:text-gray-900 cursor-pointer'
              onClick={(e) => {
                e.preventDefault();
                if (alias) {
                  navigator.clipboard.writeText(
                    `curl -X GET '${APP_BASE_URL}/api/${alias}?${demoQuery}'`
                  );
                  setCopied(true);
                }
              }}
            >
              {copied ? <SuccessIcon /> : <DefaultIcon />}
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

function FunctionExample() {
  const [code, setCode] = useState(getDefaultFunctionValue('js'));
  const [isAsync, setIsAsync] = useState(false);
  const toggleFunctionType = (selectAsync: boolean) => {
    setCode(
      selectAsync
        ? getDefaultAsyncFunctionValue('js')
        : getDefaultFunctionValue('js')
    );
    setIsAsync(selectAsync);
  };
  const getButtonStyle = (active: boolean) =>
    `font-bold rounded-full py-1 ${
      active
        ? 'border border-green-500 bg-green-300 hover:bg-green-400 text-black px-2'
        : 'bg-transparent text-black'
    }`;
  return (
    <div className='w-full flex flex-col items-center text-center gap-10'>
      <h2 className='text-3xl'>
        Create{' '}
        <button
          className={getButtonStyle(!isAsync)}
          onClick={() => toggleFunctionType(false)}
        >
          synchronous
        </button>{' '}
        and{' '}
        <button
          className={getButtonStyle(isAsync)}
          onClick={() => toggleFunctionType(true)}
        >
          asynchronous
        </button>{' '}
        functions
      </h2>
      <ViewOnlyEditor code={code} />
    </div>
  );
}

export default function Landing() {
  return (
    <main className='w-full items-center justify-items-center min-h-screen gap-16 bg-[linear-gradient(120deg,_rgb(255_255_255)_50%,_rgb(239_246_255)_50%)] bg-fixed'>
      <Header type='landing' />
      <div className='pb-4 pt-8 px-10 sm:px-0 sm:w-[60%]'>
        <div className='w-full flex flex-col items-center text-center gap-10'>
          <div>
            <h1 className='w-full font-bold text-6xl'>
              Deploy{' '}
              <span className='bg-gradient-to-r from-blue-600 via-green-500 to-indigo-400 inline-block text-transparent bg-clip-text'>
                Serverless Functions
              </span>
            </h1>
            <h2 className='w-full font-bold text-4xl'>
              right from your browser
            </h2>
          </div>
          <LandingEditor />
        </div>
      </div>
      <div className='w-full justify-items-center bg-gray-50 px-10 sm:px-40 py-10 border border-1 border-e-0 border-s-0'>
        <div className='grid sm:grid-cols-3 gap-10'>
          <div className='rounded-lg p-4 bg-blue-100 shadow-md'>
            <p className='font-bold text-2xl text-center'>Edit ✏️</p>
            <p className='text-gray-600'>
              Edit your function in the built-in editor supporting 5+ languages.
            </p>
          </div>
          <div className='rounded-lg p-4 bg-blue-200 shadow-md'>
            <p className='font-bold text-2xl text-center'>Deploy 🚀</p>
            <p className='text-gray-700'>
              Deploy your function at the click of a button.
            </p>
          </div>
          <div className='rounded-lg p-4 bg-blue-300 shadow-md'>
            <p className='font-bold text-2xl text-center'>Call ⚡</p>
            <p className='text-gray-800'>
              Call your function whenever and wherever you want via a GET or
              POST.
            </p>
          </div>
        </div>
      </div>
      <div className='py-10 pb-0 px-10 sm:px-0 sm:w-[60%]'>
        <FunctionExample />
      </div>
      <div className='w-full items-left px-10 sm:px-40 py-10 text-center'>
        <h2 className='text-3xl'>
          🔓 Unlock limitless possibilities with{' '}
          <span className='font-bold'>{'GitHub Actions Lambda 🔑'}</span>
        </h2>
        <div>
          <p className='text-gray-600 pt-1'>
            <a href='#' className='text-blue-500'>
              Sign in
            </a>{' '}
            to gain <span className='font-bold'>full access</span> to PMAL,
            including our <span className='font-bold'>API</span>.
          </p>
        </div>
      </div>
      <Footer type='landing' />
    </main>
  );
}
