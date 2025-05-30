// @ts-nocheck

export * from './cache';
export * from './constants';
export * from './functions';

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

export const getNumberOfLines = (f: string) => {
  return f.split('\n').length;
};

export const formatDate = (date: Date, full = true) =>
  full ? date.toString() : date.toString().split('T')[0];
