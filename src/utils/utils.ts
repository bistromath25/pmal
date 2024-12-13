// @ts-nocheck

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

// https://stackoverflow.com/a/31194949
export function getParameterNames(f: string) {
  return (f + '')
    .replace(/[/][/].*$/gm, '') // strip single-line comments
    .replace(/\s+/g, '') // strip white space
    .replace(/[/][*][^/*]*[*][/]/g, '') // strip multi-line comments
    .split('){', 1)[0]
    .replace(/^[^(]*[(]/, '') // extract the parameters
    .replace(/=[^,]+/g, '') // strip any ES6 defaults
    .split(',')
    .filter(Boolean); // split & filter [""]
}

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

export const validateApiKey = (key: string) => {
  return true; // accept all for now
};

export const getNumberOfLines = (f: string) => {
  return f.split('\n').length;
};
