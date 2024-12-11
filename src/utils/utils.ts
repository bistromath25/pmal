// @ts-nocheck

import { execFile } from 'child_process';

export const randomString = (n) => {
  return Math.random().toString(36).slice(-n);
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

export const executeFile = async (file: string) => {
  const { stdout } = await new Promise((resolve, reject) => {
    execFile('node', [file], (error, stdout, stderr) => {
      if (error) {
        reject(error);
        return;
      }
      resolve({ stdout });
    });
  });
  return stdout.trim();
};
