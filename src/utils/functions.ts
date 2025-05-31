import crypto from 'crypto';

export const getDefaultFunctionValue = (langauge: string) => {
  const values: Record<string, string> = {
    js: 'function add(a, b) {\n  return parseInt(a) + parseInt(b);\n}',
    py: 'def add(a, b):\n  return int(a) + int(b)',
    php: 'function add($a, $b) {\n  return (int) $a + (int) $b;\n}',
  };
  return values[langauge] ?? '';
};

export const isValidFunction = (code: string, language: string) => {
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
  const regex = regexes[language];
  return regex ? regex.test(code.split('\n')[0].trim()) : false;
};

export const getFunctionName = (
  code: string,
  language: string
): string | null => {
  const regexes: Record<string, RegExp> = {
    js: /^\s*function(.*?)\s*\(/,
    py: /^\s*def\s+([a-zA-Z_]\w*)\s*\(/,
    php: /^\s*function(.*?)\s*\(/,
  };
  const regex = regexes[language];
  const match = regex.exec(code);
  return match ? match[1].trim() : null;
};

export const getParameterNames = (
  code: string,
  language: string
): string[] | null => {
  const regexes: Record<string, RegExp> = {
    js: /^\s*function(?:\s+[a-zA-Z_]\w*)?\s*\(\s*([^\)]*)\s*\)/,
    py: /^\s*def\s+[a-zA-Z_]\w*\s*\(\s*([^\)]*)\s*\)\s*:/,
    php: /^\s*function(?:\s+[a-zA-Z_]\w*)?\s*\(\s*([^\)]*)\s*\)/,
  };
  const regex = regexes[language];
  if (!regex) return null;
  const match = regex.exec(code);
  if (!match || !match[1].trim()) return match ? [] : null;
  return match[1]
    .split(',')
    .map((param) => param.trim())
    .filter((param) => param);
};

export const getFunction = (
  s: string
): ((...args: any[]) => any) | undefined => {
  let f;
  eval(`f = ${s}`);
  return f;
};

export const getDemoQuery = (code: string, langauge: string) => {
  const params = getParameterNames(code, langauge);
  if (!params) return '';
  let result = '';
  params.forEach((x, i) => {
    result += x;
    result += `=value${i + 1}&`;
  });
  return result.slice(0, -1);
};

export const languageOptions = [
  {
    name: 'js',
    logoUrl: '/logos/nodejs.png',
  },
  {
    name: 'py',
    logoUrl: '/logos/python.png',
  },
  {
    name: 'php',
    logoUrl: '/logos/php.png',
  },
  {
    name: 'rb',
    logoUrl: '/logos/ruby.png',
  },
];

export const getAlias = (id: string) => {
  const hash = crypto.createHash('sha256').update(id).digest('hex');
  return hash.substring(0, 6);
};
