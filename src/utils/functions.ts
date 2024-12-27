export const getDefaultFunctionValue = (language: string) => {
  const values: Record<string, string> = {
    js: 'function add(a, b) {\n  return parseInt(a) + parseInt(b);\n}',
    py: 'def add(a, b):\n  return int(a) + int(b)',
    php: 'function add($a, $b) {\n  return (int) $a + (int) $b;\n}',
  };
  return values[language] ?? '';
};

export const getDefaultAsyncFunctionValue = (language: string) => {
  const values: Record<string, string> = {
    js: 'async function add(a, b) {\n  return Promise.resolve(parseInt(a) + parseInt(b));\n}',
  };
  return values[language] ?? '';
};

export const isValidFunction = (code: string, language: string) => {
  if (!code) return false;
  if (language === 'js') {
    try {
      new Function(code);
      return true;
    } catch {
      return false;
    }
  }
  const regexes: Record<string, RegExp> = {
    py: /^\s*def\s+[a-zA-Z_]\w*\s*\(\s*[^\)]*\s*\)\s*:\s*$/,
    php: /^\s*function\s+[a-zA-Z_]\w*\s*\(\s*[^\)]*\s*\)\s*\{\s*$/,
  };
  return regexes[language]?.test(code.split('\n')[0].trim()) || false;
};

export const getFunctionName = (
  code: string,
  language: string,
  isAsync?: boolean
): string | null => {
  let regexes: Record<string, RegExp> = {
    js: /^\s*function(.*?)\s*\(/,
    py: /^\s*def\s+([a-zA-Z_]\w*)\s*\(/,
    php: /^\s*function(.*?)\s*\(/,
  };
  if (isAsync) {
    regexes = {
      js: /^\s*async\s+function\s+([a-zA-Z_]\w*)\s*\(/,
    };
  }
  return regexes[language]?.exec(code)?.[1]?.trim() || null;
};

export const getParameterNames = (
  code: string,
  language: string,
  isAsync?: boolean
): string[] | null => {
  let regexes: Record<string, RegExp> = {
    js: /^\s*function(?:\s+[a-zA-Z_]\w*)?\s*\(\s*([^\)]*)\s*\)/,
    py: /^\s*def\s+[a-zA-Z_]\w*\s*\(\s*([^\)]*)\s*\)\s*:/,
    php: /^\s*function(?:\s+[a-zA-Z_]\w*)?\s*\(\s*([^\)]*)\s*\)/,
  };
  if (isAsync) {
    regexes = {
      js: /^\s*async\s+function\s+\w+\s*\(([^)]*)\s*\)/,
    };
  }
  const params = regexes[language]?.exec(code)?.[1]?.trim();
  return params
    ? params
        .split(',')
        .map((p) => p.trim())
        .filter(Boolean)
    : [];
};

export const isAsyncFunction = (code: string, language: string) => {
  const regexes: Record<string, RegExp> = {
    js: /^\s*async\s+function\s+[a-zA-Z_]\w*\s*\(/,
  };
  return regexes[language]?.test(code) || false;
};

export const getFunction = (
  s: string
): ((...args: any[]) => any) | undefined => {
  let f;
  eval(`f = ${s}`);
  return f;
};

export const getDemoQuery = (code: string, language: string) => {
  const params = getParameterNames(code, language);
  return params?.map((p, i) => `${p}=value${i + 1}`).join('&') || '';
};

export const getPrintFunctionReturnValueStatement = (
  call: string,
  language: string,
  isAsync?: boolean
) => {
  const statements: Record<string, string> = {
    js: isAsync
      ? `\n${call}.then((x) => console.log(JSON.stringify(x)));`
      : `\nconsole.log(${call});`,
    py: isAsync
      ? `\nimport asyncio\nprint(asyncio.run(${call}))`
      : `\nprint(${call})`,
    php: `print ${call};`,
  };
  return statements[language] || '';
};

export const getFunctionDetails = (code: string, language: string) => {
  const isAsync = isAsyncFunction(code, language);
  return {
    name: getFunctionName(code, language, isAsync),
    parameterNames: getParameterNames(code, language, isAsync),
    isAsync,
  };
};
