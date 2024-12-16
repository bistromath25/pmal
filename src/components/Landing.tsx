'use client';

import { useEffect, useState } from 'react';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import * as API from '@/app/api/api';
import { APP_BASE_URL } from '@/utils/env';
import {
  defaultFunctionValues,
  getDemoQuery,
  isValidFunction,
} from '@/utils/utils';
import Editor from './Editor';
import Footer from './Footer';
import Header from './Header';
import { DefaultIcon, SuccessIcon } from './Icons';

function LandingEditor() {
  const [code, setCode] = useState(defaultFunctionValues['js']);
  const [demoQuery, setDemoQuery] = useState<string | undefined>(undefined);
  const [error, setError] = useState(false);
  const [alias, setAlias] = useState<string | undefined>(undefined);
  const [copied, setCopied] = useState(false);
  const onSubmit = async () => {
    if (code && isValidFunction(code)) {
      const { alias } = await API.createFunction({
        fun: code,
        anonymous: true,
      });
      setAlias(alias);
      setDemoQuery(getDemoQuery(code));
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
        className='px-4 py-2 rounded-full border border-green-500 shadow-md bg-green-300 hover:bg-green-400 hover:border-transparent text-center disabled:cursor-not-allowed'
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

export default function Landing() {
  const session = useSession();
  const router = useRouter();
  const handleSignin = async () => {
    if (session.status === 'authenticated' && session.data.user?.email) {
      const { key } = await API.getUser({ email: session.data.user.email });
      try {
        await API.createFunction({
          fun: defaultFunctionValues['js'],
          remaining_calls: 10,
          total_calls: 0,
          alias: key,
        });
        router.push('/home');
      } catch {}
      router.push('/home');
    }
  };
  useEffect(() => {
    handleSignin();
  }, [session, router]);
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
            <p className='text-gray-600'>
              Deploy your function at the click of a button.
            </p>
          </div>
          <div className='rounded-lg p-4 bg-blue-300 shadow-md'>
            <p className='font-bold text-2xl text-center'>Call ⚡</p>
            <p className='text-gray-600'>
              Call your function whenever and wherever you want via a GET or
              POST.
            </p>
          </div>
        </div>
      </div>
      <div className='w-full items-left px-10 sm:px-40 py-10 text-center'>
        <p className='text-3xl'>
          🔓 Unlock limitless possibilities with{' '}
          <span className='font-bold'>Poor Man's AWS Lambdas 🔑</span>
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
