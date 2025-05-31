import { FunctionCreatePayload } from '@/types-v2';

export const createFunction = async (payload: FunctionCreatePayload) => {
  const response = await fetch(`/api/fun`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(payload),
  });
  if (response.ok) {
    return await response.json();
  }
  throw new Error('Unable to create function');
};
