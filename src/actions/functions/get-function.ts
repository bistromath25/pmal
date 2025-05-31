'use server';

import { env } from '@/env';
import { createClient } from '@/services/supabase/server';
import { FunctionRecord } from '@/types-v2';
import { logError } from '@/utils';

export const getFunctionById = async (id: string) => {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from(env.SUPABASE_FUNCTIONS_TABLE)
    .select('*')
    .eq('id', id);
  if (error) {
    logError(error);
    return null;
  }
  return data?.length ? (data[0] as FunctionRecord) : null;
};
