// @ts-nocheck

export * from './cache';
export * from './constants';
export * from './functions';
export * from './logger';

export const formatDate = (date: Date, full = true) =>
  full ? date.toString() : date.toString().split('T')[0];
