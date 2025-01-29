import {
  SUPABASE_ANON_KEY,
  SUPABASE_FUNCTIONS_TABLE,
  SUPABASE_TIME_ENTRIES_TABLE,
  SUPABASE_URL,
  SUPABASE_USERS_TABLE,
} from '@/env/env';
import {
  ExecutionEntryRecord,
  ExecutionEntryCreatePayload,
} from '@/types/ExecutionEntry';
import { FunctionRecord, FunctionUpdatePayload } from '@/types/Function';
import { UserUpdatePayload, UserRecord } from '@/types/User';
import { createFetch } from '@/utils/cache';
import { createClient } from '@supabase/supabase-js';

const supabaseClient = createClient(SUPABASE_URL, SUPABASE_ANON_KEY, {
  global: {
    fetch: createFetch({
      cache: 'no-store',
    }),
  },
});

const handleError = (error: Error | null) => {
  if (error) {
    throw error;
  }
};

export const createFunction = async (fun: FunctionRecord) => {
  const { error } = await supabaseClient
    .from(SUPABASE_FUNCTIONS_TABLE)
    .insert(fun);
  handleError(error);
  return fun;
};

export const getFunctionById = async (id: string) => {
  const { data, error } = await supabaseClient
    .from(SUPABASE_FUNCTIONS_TABLE)
    .select('*')
    .eq('id', id)
    .neq('frozen', true);
  handleError(error);
  return (data?.[0] as FunctionRecord) ?? null;
};

export const getFunctionByAlias = async (alias: string) => {
  const { data, error } = await supabaseClient
    .from(SUPABASE_FUNCTIONS_TABLE)
    .select('*')
    .eq('alias', alias)
    .neq('frozen', true);
  handleError(error);
  return (data?.[0] as FunctionRecord) ?? null;
};

export const updateFunctionCallsOnceById = async (id: string) => {
  const fun = await getFunctionById(id);
  const newFun = {
    ...fun,
    total_calls: fun.total_calls + 1,
    remaining_calls: fun.remaining_calls ? fun.remaining_calls - 1 : null,
    updated_at: new Date(),
  } as FunctionRecord;
  const { error } = await supabaseClient
    .from(SUPABASE_FUNCTIONS_TABLE)
    .update(newFun)
    .eq('alias', fun.alias);
  handleError(error);
  return newFun;
};

export const updateFunctionCallsOnceByAlias = async (alias: string) => {
  const fun = await getFunctionByAlias(alias);
  const newFun = {
    ...fun,
    total_calls: fun.total_calls + 1,
    remaining_calls: fun.remaining_calls ? fun.remaining_calls - 1 : null,
    updated_at: new Date(),
  } as FunctionRecord;
  const { error } = await supabaseClient
    .from(SUPABASE_FUNCTIONS_TABLE)
    .update(newFun)
    .eq('alias', fun.alias);
  handleError(error);
  return newFun;
};

export const updateFunctionById = async (fun: FunctionUpdatePayload) => {
  if (!fun.id) {
    throw new Error();
  }
  const { id, ...rest } = fun;
  const { error } = await supabaseClient
    .from(SUPABASE_FUNCTIONS_TABLE)
    .update({
      ...rest,
      updated_at: new Date(),
    })
    .eq('id', id);
  handleError(error);
  const newFun = await getFunctionById(id);
  return newFun;
};

export const updateFunctionByAlias = async (fun: FunctionUpdatePayload) => {
  if (!fun.alias) {
    throw new Error();
  }
  const { alias, ...rest } = fun;
  const { error } = await supabaseClient
    .from(SUPABASE_FUNCTIONS_TABLE)
    .update({
      ...rest,
      updated_at: new Date(),
    })
    .eq('alias', alias);
  handleError(error);
  const newFun = await getFunctionByAlias(alias);
  return newFun;
};

export const deleteFunctionById = async (id: string) => {
  const date = new Date();
  const { error } = await supabaseClient
    .from(SUPABASE_FUNCTIONS_TABLE)
    .update({
      frozen: true,
      updated_at: date,
      deleted_at: date,
    })
    .eq('id', id);
  handleError(error);
  return null;
};

export const deleteFunctionByAlias = async (alias: string) => {
  const date = new Date();
  const { error } = await supabaseClient
    .from(SUPABASE_FUNCTIONS_TABLE)
    .update({
      frozen: true,
      updated_at: date,
      deleted_at: date,
    })
    .eq('alias', alias);
  handleError(error);
  return null;
};

export const getFunctionsByIds = async (ids: string[]) => {
  const { data, error } = await supabaseClient
    .from(SUPABASE_FUNCTIONS_TABLE)
    .select('*')
    .in('id', ids)
    .neq('frozen', true);
  handleError(error);
  return data?.length ? data.map((x) => x as FunctionRecord) : [];
};

export const getFunctionsByAliases = async (aliases: string[]) => {
  const { data, error } = await supabaseClient
    .from(SUPABASE_FUNCTIONS_TABLE)
    .select('*')
    .in('alias', aliases)
    .neq('frozen', true);
  handleError(error);
  return data?.length ? data.map((x) => x as FunctionRecord) : [];
};

export const createExecutionEntry = async (
  entry: ExecutionEntryCreatePayload
) => {
  const { error } = await supabaseClient
    .from(SUPABASE_TIME_ENTRIES_TABLE)
    .insert(entry);
  handleError(error);
  return entry;
};

export const getExecutionEntryById = async (id: string) => {
  const { data, error } = await supabaseClient
    .from(SUPABASE_TIME_ENTRIES_TABLE)
    .select('*')
    .eq('id', id);
  handleError(error);
  return data?.length ? (data[0] as ExecutionEntryRecord) : null;
};

export const getExecutionEntriesByFunctionId = async (function_id: string) => {
  const { data, error } = await supabaseClient
    .from(SUPABASE_TIME_ENTRIES_TABLE)
    .select('*')
    .eq('function_id', function_id);
  handleError(error);
  return data?.length ? (data as ExecutionEntryRecord[]) : null;
};

export const getExecutionEntriesByFunctionAlias = async (
  function_alias: string
) => {
  const { data, error } = await supabaseClient
    .from(SUPABASE_TIME_ENTRIES_TABLE)
    .select('*')
    .eq('function_alias', function_alias);
  handleError(error);
  return data?.length ? (data as ExecutionEntryRecord[]) : null;
};

export const createUser = async (user: UserRecord) => {
  const { error } = await supabaseClient
    .from(SUPABASE_USERS_TABLE)
    .insert(user);
  handleError(error);
  return user;
};

export const getUserById = async (id: string) => {
  const { data, error } = await supabaseClient
    .from(SUPABASE_USERS_TABLE)
    .select('*')
    .eq('id', id);
  handleError(error);
  return data?.length ? (data[0] as UserRecord) : null;
};

export const getUserByEmail = async (email: string) => {
  const { data, error } = await supabaseClient
    .from(SUPABASE_USERS_TABLE)
    .select('*')
    .eq('email', email);
  handleError(error);
  return data?.length ? (data[0] as UserRecord) : null;
};

export const updateUser = async (user: UserUpdatePayload) => {
  const { error } = await supabaseClient
    .from(SUPABASE_USERS_TABLE)
    .update(user)
    .eq('id', user.id);
  handleError(error);
  const newUser = await getUserById(user.id);
  return newUser;
};
