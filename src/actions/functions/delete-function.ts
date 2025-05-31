'use server';

import { env } from '@/env';
import { createClient } from '@/services/supabase/server';
import { logError } from '@/utils';

export const deleteFunctionById = async (id: string) => {
  const supabase = await createClient();
  const { error } = await supabase
    .from(env.SUPABASE_FUNCTIONS_TABLE)
    .update({
      frozen: true,
    })
    .eq('id', id);

  if (error) {
    logError(error);
    return null;
  }
  return true;
};
