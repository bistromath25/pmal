'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { useSearchParams } from 'next/navigation';
import * as API from '@/app/api/api';
import { APP_BASE_URL, FF_ONLY_JS_FUNCTIONS } from '@/env/env';
import { User } from '@/types/types';
import { isValidFunction } from '@/utils/functions';
import { getDemoQuery } from '@/utils/functions';
import Editor, { EditorProps } from './Editor';
import { DefaultIcon, SuccessIcon } from './Icons';

const languageOptions = [
  {
    name: 'js',
    logoUrl: 'https://nodejs.org/static/logos/jsIconGreen.svg',
  },
  {
    name: 'py',
    logoUrl:
      'https://s3.dualstack.us-east-2.amazonaws.com/pythondotorg-assets/media/community/logos/python-logo-only.png',
  },
  {
    name: 'php',
    logoUrl: 'https://www.php.net//images/logos/php-med-trans-light.gif',
  },
];

export function LanguageSelection({
  type,
  currentLanguage,
  setCurrentLanguage,
}: {
  type: 'dashboard' | 'playground';
  currentLanguage: string;
  setCurrentLanguage: React.Dispatch<React.SetStateAction<string>>;
}) {
  const isPlayground = type === 'playground';
  return (
    <>
      {isPlayground && <h2 className='font-bold text-2xl'>Select language</h2>}
      <div className='flex flex-row gap-4'>
        {languageOptions.map(({ name, logoUrl }) => {
          return (
            <Link
              className={`rounded-lg hover:bg-gray-100 h-[50px] justify-items-center ${name === currentLanguage ? 'bg-gray-100' : 'bg-white-100'} ${FF_ONLY_JS_FUNCTIONS && name !== 'js' ? 'hover:cursor-not-allowed hover:bg-white' : ''}`}
              key={`editor-language-option-${name}`}
              href={
                isPlayground
                  ? FF_ONLY_JS_FUNCTIONS
                    ? `?language=js`
                    : `?language=${name}`
                  : ''
              }
              onClick={() => {
                if (FF_ONLY_JS_FUNCTIONS && name !== 'js') {
                  return;
                }
                setCurrentLanguage(name);
              }}
            >
              <img className='h-[50px]' src={logoUrl} alt={name} />
            </Link>
          );
        })}
      </div>
    </>
  );
}

export interface EditorPlaygroundProps extends EditorProps {
  currentUser: User;
  setLanguage: React.Dispatch<React.SetStateAction<string>>;
}

export default function EditorPlayground({
  code,
  setCode,
  language,
  onClick,
  style,
  currentUser,
  setLanguage,
}: EditorPlaygroundProps) {
  const searchParams = useSearchParams();
  const [error, setError] = useState(false);
  const [demoQuery, setDemoQuery] = useState(getDemoQuery(code, 'js'));
  const [copied, setCopied] = useState(false);
  const [loading, setLoading] = useState(false);
  const onSubmit = async () => {
    setLoading(true);
    try {
      if (isValidFunction(code, language)) {
        await API.updateFunction({ alias: currentUser.key, code });
        setDemoQuery(getDemoQuery(code, language));
        setError(false);
      } else {
        setError(true);
      }
    } finally {
      setLoading(false);
    }
  };
  useEffect(() => {
    setLanguage(searchParams.get('language') ?? language);
  }, [searchParams, language, setLanguage]);
  return (
    <div className='w-full lg:flex lg:flex-row lg:space-x-10'>
      <div className='basis-[70%] lg:basis-[100%] space-y-4'>
        <Editor
          code={code}
          setCode={setCode}
          style={style}
          error={error}
          setError={setError}
          language={language}
        />
        <div className='space-x-4'>
          <button
            className={`px-4 py-2 rounded-lg bg-green-600 hover:bg-green-700 text-center text-white hover:disabled:cursor-not-allowed ${loading ? 'opacity-50' : ''}`}
            onClick={onSubmit}
            disabled={error || !code}
          >
            Update
          </button>
        </div>
        <div className='flex items-center shadow-md rounded-lg'>
          <input
            className='animate-pulse bg-gray-50 border border-e-0 border-gray-300 text-gray-500 text-sm rounded-s-lg block w-full p-2.5 overflow-x-scroll line-clamp-1 focus:outline-none'
            value={`curl -X GET '${APP_BASE_URL}/api/${currentUser.key}?${demoQuery}'`}
            readOnly
          />
          <button
            className='flex-shrink-0 inline-flex items-center py-3 px-4 text-sm font-medium text-center text-gray-500 bg-gray-100 border border-gray-300 rounded-e-lg focus:outline-none focus:ring-gray-100 hover:bg-gray-200 hover:text-gray-900 cursor-pointer'
            onClick={(e) => {
              e.preventDefault();
              navigator.clipboard.writeText(
                `curl -X GET '${APP_BASE_URL}/api/${currentUser.key}?${demoQuery}'`
              );
              setCopied(true);
            }}
          >
            {copied ? <SuccessIcon /> : <DefaultIcon />}
          </button>
        </div>
      </div>
      <div className='basis-[30%] hidden lg:block space-y-4'>
        <LanguageSelection
          type='playground'
          currentLanguage={language}
          setCurrentLanguage={setLanguage}
        />
      </div>
    </div>
  );
}
