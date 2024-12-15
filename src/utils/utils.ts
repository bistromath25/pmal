// @ts-nocheck

export const defaultFunctionValues = {
  js: 'function add(a, b) {\n  return parseInt(a) + parseInt(b);\n}',
  py: 'def add(a, b):\n  return int(a) + int(b)',
  php: 'function add($a, $b) {\n  return (int) $a + (int) $b;\n}',
};

export const randomString = (n) => {
  return Math.random().toString(36).slice(-n);
};

export const remove = (items, item) => {
  const x = items;
  const i = x.indexOf(item);
  if (i > -1) {
    x.splice(i, 1);
  }
  return x;
};

export const isValidFunction = (s: string) => {
  try {
    new Function(s);
    return true;
  } catch (error) {
    return false;
  }
};

// https://stackoverflow.com/a/31194949
export const getParameterNames = (f: string) => {
  return (f + '')
    .replace(/[/][/].*$/gm, '') // strip single-line comments
    .replace(/\s+/g, '') // strip white space
    .replace(/[/][*][^/*]*[*][/]/g, '') // strip multi-line comments
    .split('){', 1)[0]
    .replace(/^[^(]*[(]/, '') // extract the parameters
    .replace(/=[^,]+/g, '') // strip any ES6 defaults
    .split(',')
    .filter(Boolean); // split & filter [""]
};

export const getFunction = (
  s: string
): ((...args: any[]) => any) | undefined => {
  let f;
  eval(`f = ${s}`);
  return f;
};

export const getDemoQuery = (f: string) => {
  const params = getParameterNames(f);
  var result = '';
  params.forEach((x, i) => {
    result += x;
    result += `=value${i + 1}&`;
  });
  return result.slice(0, -1);
};

export const getNumberOfLines = (f: string) => {
  return f.split('\n').length;
};
