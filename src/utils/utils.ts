// @ts-nocheck

import JSZip from 'jszip';

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

// https://stackoverflow.com/a/47663732
export const getFunctionName = (f: string) => {
  return f.match(/function(.*?)\(/)[1].trim() as string;
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

export const getFunctionFileName = (alias: string, language: string) => {
  return `${language}/${alias}.${language}`;
};
