'use client';

import { useState } from 'react';
import Marquee from 'react-fast-marquee';
import * as API from '@/app/api/api';
import { APP_BASE_URL } from '@/env/env';
import { FunctionCreatePayload } from '@/types/Function';
import {
  getDefaultFunctionValue,
  isValidFunction,
  languageOptions,
} from '@/utils/functions';
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
        const payload: FunctionCreatePayload = {
          code,
          language: 'js',
          anonymous: true,
          created_by: null,
          belongs_to: [],
        };
        const {
          fun: { alias },
        } = await API.createFunction(payload);
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
    <div className='w-full space-y-4 justify-items-center pb-20'>
      <Editor
        code={code}
        setCode={setCode}
        language='js'
        error={error}
        setError={setError}
        style={{
          backgroundColor: 'rgb(3, 7, 18)',
        }}
        colorMode='dark'
      />
      <button
        className={`px-4 py-2 rounded-full border border-blue-800 shadow-md bg-blue-600 hover:border-transparent hover:bg-blue-700 text-center text-white disabled:cursor-not-allowed font-bold ${loading ? 'bg-blue-700' : ''}`}
        onClick={onSubmit}
        disabled={error || !code}
      >
        Deploy my function!
      </button>
      {alias && (
        <>
          <div className='flex items-center shadow-md rounded-lg bg-green-300'>
            <input
              className='bg-slate-950 border border-e-0 border-blue-100 text-white text-sm rounded-s-lg block w-full p-2.5 overflow-x-scroll line-clamp-1 focus:outline-none'
              style={{
                fontFamily:
                  'ui-monospace,SFMono-Regular,SF Mono,Consolas,Liberation Mono,Menlo,monospace',
                minWidth: '560px',
              }}
              value={`curl -X GET '${APP_BASE_URL}/api/${alias}?${demoQuery}'`}
              readOnly
            />
            <button
              className='flex-shrink-0 inline-flex items-center py-3 px-4 text-sm font-medium text-center text-gray-500 bg-gray-100 border border-blue-100 rounded-e-lg focus:outline-none focus:ring-gray-100 hover:bg-gray-200 hover:text-gray-900 cursor-pointer'
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
          <p className='text-gray-600 invert mix-blend-difference'>
            Free functions are automatically deleted after 10 calls.{' '}
            <a href='/signin' className='text-blue-500'>
              Sign in
            </a>{' '}
            to get more calls!
          </p>
        </>
      )}
    </div>
  );
}

function LanguageMarquee() {
  return (
    <Marquee autoFill pauseOnHover>
      {languageOptions.map(({ name, logoUrl }) => (
        <img
          className='h-[60px] px-10'
          src={logoUrl}
          key={`language-marquee-${name}`}
        />
      ))}
    </Marquee>
  );
}

export default function Landing() {
  return (
    <main className='w-full items-center justify-items-center min-h-screen bg-black'>
      <Header type='landing' />
      <div className='w-full p-10 bg-black sm:bg-[linear-gradient(170deg,_rgb(0_0_0)_48%,_rgb(255_255_255)_48%)] bg-fixed items-center justify-items-center'>
        <div className='sm:px-0 sm:w-[60%] flex flex-col items-center text-center gap-10'>
          <div>
            <h1 className='w-full font-bold text-6xl text-white'>
              Deploy{' '}
              <span className='bg-gradient-to-r from-blue-600 via-yellow-200 to-blue-600 inline-block text-transparent bg-clip-text animate-shimmer bg-[length:200%_100%]'>
                Serverless Functions
              </span>
              <br />
              right from your browser
            </h1>
          </div>
          <LandingEditor />
        </div>
      </div>
      <div className='w-full justify-items-center bg-gray-50 p-4 px-10 sm:px-40 border border-1 border-e-0 border-s-0'>
        <div className='grid sm:grid-cols-3 gap-10'>
          <div className='rounded-lg p-4 flex flex-row space-x-4'>
            <div className='my-auto text-6xl'>
              <p>✏️</p>
            </div>
            <div>
              <p className='text-black text-2xl font-bold'>Edit</p>
              <p className='text-gray-600'>
                Edit your function in the built-in editor supporting 5+
                languages.
              </p>
            </div>
          </div>
          <div className='rounded-lg p-4 flex flex-row space-x-4'>
            <div className='my-auto text-6xl'>
              <p>🚀</p>
            </div>
            <div>
              <p className='text-black text-2xl font-bold'>Deploy</p>
              <p className='text-gray-600'>
                Deploy your function at the click of a button.
              </p>
            </div>
          </div>
          <div className='rounded-lg p-4 flex flex-row space-x-4'>
            <div className='my-auto text-6xl'>
              <p>⚡</p>
            </div>
            <div>
              <p className='text-black text-2xl font-bold'>Call</p>
              <p className='text-gray-600'>
                Call your function wherever you want via{' '}
                <span className='font-mono'>GET</span> or{' '}
                <span className='font-mono'>POST</span>.
              </p>
            </div>
          </div>
        </div>
      </div>
      <div className='w-full justify-items-center p-4 sm:px-40 sm:py-20 bg-white'>
        <div className='grid sm:grid-cols-2 gap-12'>
          <div className='my-auto text-center sm:text-left'>
            <p className='font-bold text-3xl'>
              Deploy <span className='bg-green-300'>serverless functions</span>{' '}
              right from your browser using{' '}
              <span className='bg-yellow-200'>GitHub Actions</span> as a
              computing backend.
            </p>
          </div>
          <div className='my-auto hidden sm:inline-block'>
            <div
              className='w-full pt-8 pb-8 bg-gray-50 border border-1 border-e-0 border-s-0'
              style={{
                maskImage:
                  'linear-gradient(to right, rgba(248, 251, 253, 0), black 10%, black 90%, rgba(248, 251, 253, 0))',
                maskType: 'alpha',
              }}
            >
              <LanguageMarquee />
            </div>
          </div>
        </div>
      </div>
      <div className='w-full justify-items-center p-4 sm:px-40 bg-gray-50 border border-1 border-e-0 border-s-0 hidden sm:block'>
        <p className='w-[80%] text-center text-black font-bold text-2xl'>
          Where performance meets simplicity
        </p>
        <p className='w-[80%] text-gray-600 text-lg'>
          <span className='font-bold'>Each function invocation</span> triggers
          its own containerized workflow through GitHub Actions, delivering an
          event-driven architecture powered by some of the toughest machines
          available. <span className='font-bold'>Function arguments</span> are
          provided through query parameters, enabling seamless integration with
          webhooks, APIs, and other event sources.
        </p>
      </div>
      <div className='w-full items-left p-4 sm:px-40 sm:py-20 text-center bg-white'>
        <p className='text-3xl'>
          🔓 Unlock limitless possibilities with{' '}
          <span className='font-bold'>{'GitHub Actions Lambda 🔑'}</span>
        </p>
        <div>
          <p className='text-gray-600 pt-1'>
            <a href='/signin' className='text-blue-500'>
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
