'use server';

import { env } from '@/env';
import { createServiceRoleClent } from '@/services/supabase/server';
import { ExecutionEntryCreatePayload } from '@/types';
import { logError } from '@/utils';

export const serviceRoleCreateExecutionEntry = async (
  payload: ExecutionEntryCreatePayload
) => {
  const supabase = await createServiceRoleClent();
  const { error } = await supabase
    .from(env.SUPABASE_TIME_ENTRIES_TABLE)
    .insert(payload);
  if (error) {
    logError(error);
    return null;
  }
  return true;
};
