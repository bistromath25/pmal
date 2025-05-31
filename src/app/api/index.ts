import {
  ExecutionEntryGetPayload,
  ExecutionEntryGetManyPayload,
  FunctionCreatePayload,
  FunctionDeletePayload,
  FunctionGetManyPayload,
  FunctionGetPayload,
  FunctionUpdatePayload,
  UserCreatePayload,
  UserGetPayload,
  UserUpdatePayload,
} from '@/types';

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

export const createFunctionWithAlias = async (
  payload: FunctionCreatePayload & { alias: string }
) => {
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

export const getFunction = async ({ alias, id }: FunctionGetPayload) => {
  const query = alias ? `alias=${alias}` : `id=${id}`;
  const response = await fetch(`/api/fun?${query}`, {
    method: 'GET',
  });
  if (response.ok) {
    return await response.json();
  }
  throw new Error(
    alias
      ? `Unable to get function by alias ${alias}`
      : `Unable to get function by id ${id}`
  );
};

export const getFunctions = async ({
  aliases,
  ids,
}: FunctionGetManyPayload) => {
  const response = await fetch('/api/funs', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ aliases, ids }),
  });
  if (response.ok) {
    return await response.json();
  }
  throw new Error(
    aliases
      ? `Unable to get functions by aliases ${JSON.stringify(aliases, null, 2)}`
      : `Unable to get functions by ids ${JSON.stringify(ids, null, 2)}`
  );
};

export const updateFunction = async (payload: FunctionUpdatePayload) => {
  const response = await fetch('/api/fun', {
    method: 'PATCH',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(payload),
  });
  if (response.ok) {
    return await response.json();
  }
  throw new Error(`Unable to update function by id ${payload.id}`);
};

export const deleteFunction = async ({ alias, id }: FunctionDeletePayload) => {
  const response = await fetch('/api/fun', {
    method: 'DELETE',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ alias, id }),
  });
  if (response.ok) {
    return await response.json();
  }
  throw new Error(
    alias
      ? `Unable to delete function by alias ${alias}`
      : `Unable to delete function by id ${id}`
  );
};

export const getExecutionEntryById = async ({
  id,
}: ExecutionEntryGetPayload) => {
  const response = await fetch(`api/execentry?id=${id}`, {
    method: 'GET',
  });
  if (response.ok) {
    return await response.json();
  }
  throw new Error(`Unable to get execution entry by id ${id}`);
};

export const getExecutionEntries = async ({
  function_id,
  function_alias,
}: ExecutionEntryGetManyPayload) => {
  const query = function_id
    ? `function_id=${function_id}`
    : `function_alias=${function_alias}`;
  const response = await fetch(`api/execentries?${query}`, {
    method: 'GET',
  });
  if (response.ok) {
    return await response.json();
  }
  throw new Error(
    function_id
      ? `Unable to get execution entries by function_id ${function_id}`
      : `Unable to get execution entries by function_alias ${function_alias}`
  );
};

export const createUser = async (payload: UserCreatePayload) => {
  const response = await fetch('/api/user', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(payload),
  });
  if (response.ok) {
    return await response.json();
  }
  return new Error('Unable to create user');
};

export const getUser = async ({ email, id }: UserGetPayload) => {
  const query = email ? `email=${email}` : `id=${id}`;
  const response = await fetch(`/api/user?${query}`, {
    method: 'GET',
  });
  if (response.ok) {
    return await response.json();
  }
  return new Error(
    email
      ? `Unable to get user by email ${email}`
      : `Unable to get user by id ${id}`
  );
};

export const updateUser = async (payload: UserUpdatePayload) => {
  const response = await fetch('/api/user', {
    method: 'PATCH',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(payload),
  });
  if (response.ok) {
    return await response.json();
  }
  return new Error(`Unable to update user by id ${payload.id}`);
};

export const signupUser = async (payload: {
  email: string;
  password: string;
}) => {
  const response = await fetch('/api/auth/signup', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(payload),
  });
  if (response.ok) {
    return await response.json();
  }
  return new Error(`Unable to login user`);
};

export const loginUser = async (payload: {
  email: string;
  password: string;
}) => {
  const response = await fetch('/api/auth/login', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(payload),
  });
  if (response.ok) {
    return await response.json();
  }
  return new Error(`Unable to login user`);
};
