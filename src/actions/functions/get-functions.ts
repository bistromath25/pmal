'use server';

import { env } from '@/env';
import { createClient } from '@/services/supabase/server';
import { FunctionRecord } from '@/types-v2';
import { logError } from '@/utils';

export const getFunctionsByUserId = async (user_id: string) => {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from(env.SUPABASE_FUNCTIONS_TABLE)
    .select('*')
    .eq('user_id', user_id)
    .eq('frozen', false)
    .order('created_at', { ascending: false });
  if (error) {
    logError(error);
    return null;
  }
  return data?.length ? (data as FunctionRecord[]) : [];
};
