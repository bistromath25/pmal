'use client';

import React from 'react';
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
  onClick?: (e: any) => void;
  style?: React.CSSProperties;
  error?: boolean;
  language?: string;
}

export default function Editor({
  code,
  setCode,
  onClick,
  style,
  error,
  language,
}: EditorProps) {
  const combinedStyle = {
    fontSize: '18px',
    minHeight: '200px',
    overflow: 'visible',
    ...style,
    backgroundColor: '#f5f5f5',
    fontFamily:
      'ui-monospace,SFMono-Regular,SF Mono,Consolas,Liberation Mono,Menlo,monospace',
  };

  return (
    <>
      <CodeEditor
        className='w-full p-2 rounded-lg border border-blue-100 shadow-sm'
        value={code}
        language={language ?? 'js'}
        onChange={(evn) => setCode(evn.target.value)}
        padding={15}
        style={combinedStyle}
        onClick={onClick}
      />
      {error && <Warning />}
    </>
  );
}
