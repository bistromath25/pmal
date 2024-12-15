import { Function, FunctionDatabaseEntity, User } from '@/utils/types';
import { createFetch } from './cache';
import { supabaseKey, supabaseUrl } from './env';
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
    .select('fun, total_calls, remaining_calls, anonymous, language')
    .eq('alias', alias)
    .neq('frozen', true);
  if (data && data.length > 0) {
    const { fun, total_calls, remaining_calls, anonymous, language } = data[0];
    if (anonymous && total_calls >= 10) {
      deleteFunctionByAlias(alias);
      return null;
    }
    return { alias, fun, total_calls, remaining_calls, language } as Function;
  }
  if (error) {
    throw error;
  }
  return null;
};

export const updateFunctionCallsOnceByAlias = async (alias: string) => {
  const { error } = await supabaseClient.rpc('updatefunctioncallsoncebyalias', {
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
    .eq('alias', fun.alias)
    .neq('frozen', true);
  if (error) {
    throw error;
  }
  return null;
};

export const deleteFunctionByAlias = async (alias: string) => {
  const { error } = await supabaseClient.rpc('freezefunctionbyalias', {
    x: alias,
  });
  if (error) {
    throw error;
  }
  return null;
};

export const getFunctionsByAliases = async (aliases: string[]) => {
  const { data, error } = await supabaseClient
    .from('functions')
    .select('*')
    .in('alias', aliases)
    .neq('frozen', true);
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
    .select('email, aliases, key')
    .eq('email', email);
  if (data && data[0]) {
    return data[0];
  }
  if (error) {
    throw error;
  }
  return null;
};

export const updateUser = async (user: Partial<User>) => {
  const { error } = await supabaseClient
    .from('users')
    .update(user)
    .eq('email', user.email);
  if (error) {
    throw error;
  }
  return null;
};
