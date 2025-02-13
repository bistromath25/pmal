'use client';

import { useDeferredValue, useEffect } from 'react';
import { isValidFunction } from '@/utils/functions';
import CodeEditor from '@uiw/react-textarea-code-editor';

export function Warning() {
  return (
    <p className='w-full p-2 rounded-lg bg-red-500 text-center text-white'>
      ⚠️ Error! Not a valid function! ⚠️
    </p>
  );
}

export interface EditorProps {
  code: string;
  setCode: React.Dispatch<React.SetStateAction<string>>;
  language: string;
  onClick?: (e: any) => void;
  style?: React.CSSProperties;
  error?: boolean;
  setError?: React.Dispatch<React.SetStateAction<boolean>>;
  colorMode?: 'light' | 'dark';
}

export default function Editor({
  code,
  setCode,
  language,
  onClick,
  style,
  error,
  setError,
  colorMode,
}: EditorProps) {
  const combinedStyle = {
    fontSize: '18px',
    minHeight: '200px',
    overflow: 'visible',
    backgroundColor: '#f5f5f5',
    ...style,
    fontFamily:
      'ui-monospace,SFMono-Regular,SF Mono,Consolas,Liberation Mono,Menlo,monospace',
  };
  const deferredCode = useDeferredValue(code);
  useEffect(() => {
    if (setError) {
      setError(!isValidFunction(deferredCode, language));
    }
  }, [language, deferredCode, setError]);
  return (
    <>
      <CodeEditor
        className='w-full p-2 rounded-lg border border-[rgb(227_232_239)] shadow-sm'
        value={code}
        language={language}
        onChange={(e) => setCode(e.target.value)}
        padding={15}
        style={combinedStyle}
        onClick={onClick}
        data-color-mode={colorMode ?? 'light'}
      />
      {error && <Warning />}
    </>
  );
}
