'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useSearchParams } from 'next/navigation';
import * as API from '@/app/api/api';
import { APP_BASE_URL } from '@/utils/env';
import { User } from '@/utils/types';
import {
  defaultFunctionValues,
  getDemoQuery,
  isValidFunction,
} from '@/utils/utils';
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

function LanguageSelection() {
  const searchParams = useSearchParams();
  return (
    <>
      <div className='font-bold text-2xl'>Select language</div>
      <div className='flex flex-row gap-4'>
        {languageOptions.map(({ name, logoUrl }) => {
          const isActive = name === searchParams.get('language');
          return (
            <Link
              className={`rounded-lg hover:bg-gray-100 h-[50px] justify-items-center ${isActive ? 'bg-gray-100' : 'bg-white-100'}`}
              key={`editor-language-option-${name}`}
              // href={{} || `/editor?language=${name}`}
              href=''
              // onClick={() => {
              //   setCurrentLanguage(name);
              // }}
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
  const [currentLanguage, setCurrentLanguage] = useState('js');
  const onSubmit = async () => {
    if (code && isValidFunction(code)) {
      await API.updateFunction({ alias: currentUser.key, code });
      setDemoQuery(getDemoQuery(code));
      setError(false);
    } else {
      setError(true);
    }
  };
  // useEffect(() => {
  //   if (currentLanguage === 'js') {
  //     setCode(defaultFunctionValues['js']);
  //   } else if (currentLanguage === 'py') {
  //     setCode(defaultFunctionValues['py']);
  //   } else if (currentLanguage === 'php') {
  //     setCode(defaultFunctionValues['php']);
  //   }
  // }, [currentLanguage, setCode]);
  return (
    <div className='w-full lg:flex lg:flex-row lg:space-x-10'>
      <div className='basis-[70%] lg:basis-[100%] space-y-4'>
        <Editor
          code={code}
          setCode={setCode}
          style={style}
          error={error}
          language={currentLanguage}
        />
        <div className='space-x-4'>
          <button
            className='px-4 py-2 rounded-lg bg-green-600 hover:bg-green-700 text-center text-white'
            onClick={onSubmit}
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
            <DefaultIcon hidden={copied} />
            <SuccessIcon hidden={!copied} />
          </button>
        </div>
      </div>
      <div className='basis-[30%] hidden lg:block space-y-4'>
        <LanguageSelection />
      </div>
    </div>
  );
}
