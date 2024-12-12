import { createFetch } from './cache';
import { supabaseKey, supabaseUrl } from './env';
import { Function } from '@/utils/types';
import { createClient } from '@supabase/supabase-js';

const supabaseClient = createClient(supabaseUrl, supabaseKey, {
  global: {
    fetch: createFetch({
      cache: 'no-store',
    }),
  },
});

export const createFunction = async (f: Function) => {
  const { error } = await supabaseClient.from('functions').insert(f);
  if (error) {
    throw error;
  }
  return null;
};

export const getFunctionByAlias = async (alias: string) => {
  const { data, error } = await supabaseClient
    .from('functions')
    .select('fun, total_calls, remaining_calls')
    .eq('alias', alias);
  if (data && data.length > 0) {
    const { remaining_calls } = data[0];
    return remaining_calls > 0 ? data[0] as Function : null;
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
