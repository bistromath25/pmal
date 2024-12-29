'use client';

import { useState } from 'react';
import * as API from '@/app/api/api';
import { APP_BASE_URL } from '@/env/env';
import { getDefaultFunctionValue, isValidFunction } from '@/utils/functions';
import { getDemoQuery } from '@/utils/functions';
import Editor from './Editor';
import Footer from './Footer';
import Header from './Header';
import { DefaultIcon, SuccessIcon } from './Icons';

function LandingEditor() {
  const [code, setCode] = useState(getDefaultFunctionValue('js'));
  const [demoQuery, setDemoQuery] = useState<string | undefined>(undefined);
  const [error, setError] = useState(false);
  const [alias, setAlias] = useState<string | undefined>(undefined);
  const [copied, setCopied] = useState(false);
  const [loading, setLoading] = useState(false);
  const onSubmit = async () => {
    setLoading(true);
    try {
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
      }
    } finally {
      setLoading(false);
    }
  };
  return (
    <div className='w-full space-y-4 justify-items-center'>
      <Editor
        code={code}
        setCode={setCode}
        language='js'
        error={error}
        setError={setError}
      />
      <button
        className={`px-4 py-2 rounded-full border border-green-500 shadow-md bg-green-300 hover:bg-green-400 hover:border-transparent text-center disabled:cursor-not-allowed font-bold ${loading ? 'opacity-50' : ''}`}
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
            <p className='font-bold text-2xl text-center'>Edit</p>
            <p className='text-gray-600'>
              Edit your function in the built-in editor supporting 5+ languages.
            </p>
          </div>
          <div className='rounded-lg p-4 bg-blue-200 shadow-md'>
            <p className='font-bold text-2xl text-center'>Deploy</p>
            <p className='text-gray-700'>
              Deploy your function at the click of a button.
            </p>
          </div>
          <div className='rounded-lg p-4 bg-blue-300 shadow-md'>
            <p className='font-bold text-2xl text-center'>Call</p>
            <p className='text-gray-800'>
              Call your function whenever and wherever you want via{' '}
              <span className='font-mono'>GET</span> or{' '}
              <span className='font-mono'>POST</span>.
            </p>
          </div>
        </div>
      </div>
      <div className='w-full justify-items-center px-10 sm:px-40 pt-10'>
        <div className='grid sm:grid-cols-2 gap-12'>
          <div className='my-auto'>
            <p className='font-bold text-3xl'>
              Deploy <span className='bg-green-300'>serverless functions</span>{' '}
              right from your browser using{' '}
              <span className='bg-yellow-200'>GitHub Actions</span> as a
              computing backend.
            </p>
          </div>
          <div className='rounded-lg p-4 bg-gray-50 shadow-md my-auto'>
            <p className='text-gray-600 text-lg'>
              Each function invocation triggers its own containerized workflow
              through GitHub Actions, delivering an event-driven architecture.
              Function arguments are provided through query parameters, enabling
              seamless integration with webhooks, APIs, and other event sources.
            </p>
          </div>
        </div>
      </div>
      <div className='w-full items-left px-10 sm:px-40 py-10 text-center'>
        <p className='text-3xl'>
          🔓 Unlock limitless possibilities with{' '}
          <span className='font-bold'>{'GitHub Actions Lambda 🔑'}</span>
        </p>
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
