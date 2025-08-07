'use server';

import { env } from '@/env';
import { createClient } from '@/services/supabase/server';
import { FunctionRecord } from '@/types';
import { logError } from '@/utils';

const PAGE_SIZE = 10;

export const getFunctionsByUserId = async (
  user_id: string,
  page: number = 1
) => {
  const supabase = await createClient();
  const from = (page - 1) * PAGE_SIZE;
  const to = from + PAGE_SIZE - 1;
  const { count, data, error } = await supabase
    .from(env.SUPABASE_FUNCTIONS_TABLE)
    .select('*', { count: 'exact' })
    .eq('user_id', user_id)
    .eq('frozen', false)
    .order('created_at', { ascending: false })
    .range(from, to);
  if (error) {
    logError(error);
    return null;
  }
  const records = (data as FunctionRecord[]) || [];
  return {
    data: records,
    count: count || 0,
    totalPages: Math.ceil((count || 0) / PAGE_SIZE),
  };
};
