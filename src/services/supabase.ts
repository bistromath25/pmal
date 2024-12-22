import { createFetch } from '@/utils/cache';
import { SUPABASE_ANON_KEY, SUPABASE_URL } from '@/utils/env';
import { Function, FunctionDatabaseEntity, User } from '@/utils/types';
import { createClient } from '@supabase/supabase-js';

const supabaseClient = createClient(SUPABASE_URL, SUPABASE_ANON_KEY, {
  global: {
    fetch: createFetch({
      cache: 'no-store',
    }),
  },
});

export const createFunction = async (fun: FunctionDatabaseEntity) => {
  const { error } = await supabaseClient.from('functions').insert(fun);
  if (error) {
    throw error;
  }
  return fun as Function;
};

export const getFunctionByAlias = async (alias: string) => {
  const { data, error } = await supabaseClient
    .from('functions')
    .select('*')
    .eq('alias', alias)
    .neq('frozen', true);
  if (error) {
    throw error;
  }
  if (data?.length) {
    const { code, total_calls, remaining_calls, anonymous, language } = data[0];
    if (anonymous && total_calls >= 10) {
      deleteFunctionByAlias(alias);
      return null;
    }
    return { alias, code, total_calls, remaining_calls, language } as Function;
  }
  return null;
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
  if (error) {
    throw error;
  }
  return newFun;
};

export const updateFunction = async (fun: Function) => {
  const { error } = await supabaseClient
    .from('functions')
    .update(fun)
    .eq('alias', fun.alias);
  if (error) {
    throw error;
  }
  return fun;
};

export const deleteFunctionByAlias = async (alias: string) => {
  const { error } = await supabaseClient
    .from('functions')
    .update({
      frozen: true,
    })
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
    .in('alias', aliases)
    .neq('frozen', true);
  if (error) {
    throw error;
  }
  return data?.length ? data.map((x) => x as Function) : [];
};

export const createUser = async (user: User) => {
  const { error } = await supabaseClient.from('users').insert(user);
  if (error) {
    throw error;
  }
  return user;
};

export const getUserByEmail = async (email: string) => {
  const { data, error } = await supabaseClient
    .from('users')
    .select('email, aliases, key')
    .eq('email', email);
  if (error) {
    throw error;
  }
  return data?.length ? (data[0] as User) : null;
};

export const updateUser = async (user: User) => {
  const { error } = await supabaseClient
    .from('users')
    .update(user)
    .eq('email', user.email);
  if (error) {
    throw error;
  }
  return user;
};
