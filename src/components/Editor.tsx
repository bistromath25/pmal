'use client';

import React, { useState } from 'react';
import CodeEditor from '@uiw/react-textarea-code-editor';
import * as API from '@/app/api/api';
import { getDemoQuery } from '@/utils/utils';
import { APP_BASE_URL } from '@/utils/env';

function Warning() {
  return (
    <p className='w-full p-2 rounded-lg border border-red-200 bg-red-100 text-center'>
      ⚠️ Syntax error! ⚠️
    </p>
  );
}

export default function App() {
  const [code, setCode] = useState(`function add(a, b) {\n  return a + b;\n}`);
  const [demoQuery, setDemoQuery] = useState<string | undefined>(undefined);
  const [error, setError] = useState(false);
  const [alias, setAlias] = useState<string | undefined>(undefined);
  const onSubmit = async () => {
    try {
      const { alias } = await API.createFunction({
        fun: code,
        remaining_calls: 0,
      });
      setAlias(alias);
      setDemoQuery(getDemoQuery(code));
      setError(false);
    } catch (e) {
      setError(true);
    }
  };
  return (
    <div className='w-full space-y-4'>
      <CodeEditor
        className='w-full p-2 rounded-lg border border-blue-100 shadow-sm'
        value={code}
        language='js'
        placeholder='//'
        onChange={(evn) => setCode(evn.target.value)}
        padding={15}
        style={{
          backgroundColor: '#f5f5f5',
          fontFamily:
            'ui-monospace,SFMono-Regular,SF Mono,Consolas,Liberation Mono,Menlo,monospace',
          fontSize: '18px',
        }}
      />
      {error && <Warning />}
      <button
        className='w-full p-2 rounded-full border border-blue-100 shadow-sm hover:bg-gray-100 hover:border-transparent text-center'
        onClick={onSubmit}
      >
        Go!
      </button>
      {alias && (
        <p className='p-2 overflow-x-scroll'>{`curl -X POST '${APP_BASE_URL}/api/${alias}?${demoQuery}'`}</p>
      )}
    </div>
  );
}
