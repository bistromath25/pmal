import { Function } from '@/utils/types';

export const createFunction = async ({
  fun,
  remaining_calls,
}: Partial<Function>) => {
  const response = await fetch(`/api/fun`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      fun,
      remaining_calls,
      total_calls: 0,
    }),
  });
  if (response.ok) {
    return await response.json();
  }
  throw new Error('Unable to create function');
};

export const getFunction = async ({ alias }: { alias: string }) => {
  const response = await fetch(`/api/${alias}`, {
    method: 'POST',
  });
  if (response.ok) {
    return await response.json();
  }
  throw new Error(`Unable to get function by alias ${alias}`);
};
