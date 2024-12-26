import { SUPABASE_ANON_KEY, SUPABASE_URL } from '@/env/env';
import { Function, FunctionDatabaseEntity, User } from '@/types/types';
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

export const createFunction = async (fun: FunctionDatabaseEntity) => {
  const { error } = await supabaseClient.from('functions').insert(fun);
  handleError(error);
  return fun as Function;
};

export const getFunctionByAlias = async (alias: string) => {
  const { data, error } = await supabaseClient
    .from('functions')
    .select('*')
    .eq('alias', alias)
    .neq('frozen', true);
  handleError(error);
  return (data?.[0] as FunctionDatabaseEntity) ?? null;
};

export const updateFunctionCallsOnceByAlias = async (alias: string) => {
  const fun = (await getFunctionByAlias(alias)) as Function;
  const newFun = {
    ...fun,
    total_calls: fun.total_calls + 1,
    remaining_calls: fun.remaining_calls - 1,
  } as Function;
  const { error } = await supabaseClient
    .from('functions')
    .update(newFun)
    .eq('alias', fun.alias);
  handleError(error);
  return newFun;
};

export const updateFunction = async (fun: Function) => {
  const { error } = await supabaseClient
    .from('functions')
    .update(fun)
    .eq('alias', fun.alias);
  handleError(error);
  return fun;
};

export const deleteFunctionByAlias = async (alias: string) => {
  const { error } = await supabaseClient
    .from('functions')
    .update({
      frozen: true,
    })
    .eq('alias', alias);
  handleError(error);
  return null;
};

export const getFunctionsByAliases = async (aliases: string[]) => {
  const { data, error } = await supabaseClient
    .from('functions')
    .select('*')
    .in('alias', aliases)
    .neq('frozen', true);
  handleError(error);
  return data?.length ? data.map((x) => x as Function) : [];
};

export const createUser = async (user: User) => {
  const { error } = await supabaseClient.from('users').insert(user);
  handleError(error);
  return user;
};

export const getUserByEmail = async (email: string) => {
  const { data, error } = await supabaseClient
    .from('users')
    .select('email, aliases, key')
    .eq('email', email);
  handleError(error);
  return data?.length ? (data[0] as User) : null;
};

export const updateUser = async (user: User) => {
  const { error } = await supabaseClient
    .from('users')
    .update(user)
    .eq('email', user.email);
  handleError(error);
  return user;
};
