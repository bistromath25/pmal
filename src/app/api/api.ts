import { FunctionDatabaseEntity, User } from '@/utils/types';

export const createFunction = async ({
  fun,
  remaining_calls,
  anonymous,
  language,
}: Partial<FunctionDatabaseEntity>) => {
  const response = await fetch(`/api/fun`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      fun,
      remaining_calls,
      total_calls: 0,
      anonymous,
      language,
    }),
  });
  if (response.ok) {
    return await response.json();
  }
  throw new Error('Unable to create function');
};

export const getFunction = async (
  { alias }: { alias: string },
  fun = false
) => {
  const response = await fetch(`/api/${alias}${fun ? '?fun=true' : ''}`, {
    method: 'GET',
  });
  if (response.ok) {
    return await response.json();
  }
  throw new Error(`Unable to get function by alias ${alias}`);
};

export const updateFunction = async ({
  alias,
  fun,
  total_calls,
  remaining_calls,
}: Partial<FunctionDatabaseEntity>) => {
  const response = await fetch('/api/fun', {
    method: 'PATCH',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      alias,
      fun,
      ...(total_calls && { total_calls }),
      ...(remaining_calls && { remaining_calls }),
    }),
  });
  if (response.ok) {
    return await response.json();
  }
  throw new Error(`Unable to update function by alias ${alias}`);
};

export const deleteFunction = async ({ alias }: { alias: string }) => {
  const response = await fetch('/api/fun', {
    method: 'DELETE',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ alias }),
  });
  if (response.ok) {
    return await response.json();
  }
  throw new Error(`Unable to delete function by alias ${alias}`);
};

export const getFunctions = async ({ aliases }: { aliases: string[] }) => {
  const response = await fetch('/api/funs', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ aliases }),
  });
  if (response.ok) {
    return await response.json();
  }
  throw new Error('Unable to get functions');
};

export const getAllFunctions = async () => {
  const response = await fetch('/api/funs', {
    method: 'POST',
  });
  if (response.ok) {
    return await response.json();
  }
  return new Error('Unable to get all functions');
};

export const getUser = async ({ email }: Partial<User>) => {
  const response = await fetch('/api/user', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ email }),
  });
  if (response.ok) {
    return await response.json();
  }
  return new Error(`Unable to create user by email ${email}`);
};

export const updateUser = async (user: User) => {
  const response = await fetch('/api/user', {
    method: 'PATCH',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ user }),
  });
  if (response.ok) {
    return await response.json();
  }
  return new Error(`Unable to update user by email ${user.email}`);
};
