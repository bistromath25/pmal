'use server';

import { env } from '@/env';
import { createClient } from '@/services/supabase/server';
import { ExecutionEntryRecord } from '@/types';
import { logError } from '@/utils';

export const getExecutionEntryByUserId = async (user_id: string) => {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from(env.SUPABASE_TIME_ENTRIES_TABLE)
    .select('*')
    .eq('user_id', user_id)
    .order('created_at', { ascending: false });
  if (error) {
    logError(error);
    return null;
  }
  return data?.length ? (data as ExecutionEntryRecord[]) : [];
};
