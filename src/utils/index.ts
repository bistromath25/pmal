// @ts-nocheck

export * from './cache';
export * from './constants';
export * from './functions';
export * from './logger';

export function formatLocalDate(date: Date, full = true): string {
  return full ? date.toLocaleString() : date.toLocaleDateString();
}

export function getStartOfDay(dateStr: string, isUtc: boolean = false): Date {
  const date = new Date(dateStr);
  if (isUtc) {
    return new Date(
      Date.UTC(
        date.getUTCFullYear(),
        date.getUTCMonth(),
        date.getUTCDate(),
        0,
        0,
        0,
        0
      )
    );
  } else {
    return new Date(
      date.getFullYear(),
      date.getMonth(),
      date.getDate(),
      0,
      0,
      0,
      0
    );
  }
}

export function getEndOfDay(dateStr: string, isUtc: boolean = false): Date {
  const date = new Date(dateStr);
  if (isUtc) {
    return new Date(
      Date.UTC(
        date.getUTCFullYear(),
        date.getUTCMonth(),
        date.getUTCDate(),
        23,
        59,
        59,
        999
      )
    );
  } else {
    return new Date(
      date.getFullYear(),
      date.getMonth(),
      date.getDate(),
      23,
      59,
      59,
      999
    );
  }
}
