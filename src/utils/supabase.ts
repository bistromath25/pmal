import { createFetch } from './cache';
import { supabaseKey, supabaseUrl } from './env';
import { Function, FunctionDatabaseEntity, User } from '@/utils/types';
import { createClient } from '@supabase/supabase-js';

const supabaseClient = createClient(supabaseUrl, supabaseKey, {
  global: {
    fetch: createFetch({
      cache: 'no-store',
    }),
  },
});

export const createFunction = async (f: FunctionDatabaseEntity) => {
  const { error } = await supabaseClient.from('functions').insert(f);
  if (error) {
    throw error;
  }
  return null;
};

export const getFunctionByAlias = async (alias: string) => {
  const { data, error } = await supabaseClient
    .from('functions')
    .select('fun, total_calls, remaining_calls, anonymous')
    .eq('alias', alias);
  if (data && data.length > 0) {
    const { fun, total_calls, remaining_calls, anonymous } = data[0];
    return anonymous && total_calls >= 10
      ? null
      : ({ alias, fun, total_calls, remaining_calls } as Function);
  }
  if (error) {
    throw error;
  }
  return null;
};

export const updateFunctionCallsOnceByAlias = async (alias: string) => {
  const { error } = await supabaseClient.rpc('updatecallsonce', {
    x: alias,
  });
  if (error) {
    throw error;
  }
  return null;
};

export const updateFunction = async (
  fun: Partial<{
    alias: string;
    fun: string;
    total_calls?: number;
    remaining_calls?: number;
  }>
) => {
  const { error } = await supabaseClient
    .from('functions')
    .update({ ...fun })
    .eq('alias', fun.alias);
  if (error) {
    throw error;
  }
  return null;
};

export const deleteFunctionByAlias = async (alias: string) => {
  const { error } = await supabaseClient
    .from('functions')
    .delete()
    .eq('alias', alias);
  if (error) {
    throw error;
  }
  return null;
};

export const getFunctionsByAliases = async (aliases: string[]) => {
  const { data, error } = await supabaseClient
    .from('functions')
    .select('*')
    .in('alias', aliases);
  if (data && data[0]) {
    return data;
  }
  if (error) {
    throw error;
  }
  return null;
};

export const getAllFunctions = async () => {
  const { data, error } = await supabaseClient.from('functions').select('*');
  if (data) {
    return data;
  }
  if (error) {
    throw error;
  }
  return null;
};

export const createUser = async (user: User) => {
  const { error } = await supabaseClient.from('users').insert(user);
  if (error) {
    throw error;
  }
  return null;
};

export const getUserByEmail = async (email: string) => {
  const { data, error } = await supabaseClient
    .from('users')
    .select('email, aliases')
    .eq('email', email);
  if (data && data[0]) {
    return data[0];
  }
  if (error) {
    throw error;
  }
  return null;
};

export const updateUser = async (user: User) => {
  const { error } = await supabaseClient
    .from('users')
    .update(user)
    .eq('email', user.email);
  if (error) {
    throw error;
  }
  return null;
};
