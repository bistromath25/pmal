// @ts-nocheck

export * from './cache';
export * from './constants';
export * from './functions';
export * from './logger';

export const formatDate = (date: Date, full = true) =>
  full ? date.toString() : date.toString().split('T')[0];

export const validPasswordLength = (password: string) => {
  return password.length >= 8;
};

export const passwordContainsSpaces = (password: string) => {
  return /\s/.test(password);
};

export const isValidEmail = (email: string) => {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim());
};
