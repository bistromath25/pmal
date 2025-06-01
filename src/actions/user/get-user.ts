'use server';

import { env } from '@/env';
import { createClient } from '@/services/supabase/server';
import { UserRecord } from '@/types';
import { logError } from '@/utils';

export const getSessionUser = async () => {
  const supabase = await createClient();
  return await supabase?.auth?.getUser();
};

export const getDbUser = async (id: string) => {
  if (!id) {
    return null;
  }

  const supabase = await createClient();
  const { data, error } = await supabase
    .from(env.SUPABASE_USERS_TABLE)
    .select('*')
    .eq('id', id);

  if (error) {
    logError(error);
    return null;
  }
  return data?.length ? (data[0] as UserRecord) : null;
};
