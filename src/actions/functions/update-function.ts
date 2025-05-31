'use server';

import { env } from '@/env';
import { createClient } from '@/services/supabase/server';
import { FunctionUpdatePayload } from '@/types-v2';
import { logError } from '@/utils';

export const updateFunctionById = async (payload: FunctionUpdatePayload) => {
  const { id, ...rest } = payload;
  const supabase = await createClient();
  const { error } = await supabase
    .from(env.SUPABASE_FUNCTIONS_TABLE)
    .update({ ...rest, updated_at: new Date() })
    .eq('id', id);

  if (error) {
    logError(error);
    return null;
  }
  return true;
};

export const setFunctionAliasById = async ({
  id,
  alias,
}: {
  id: string;
  alias: string;
}) => {
  const supabase = await createClient();
  const { error } = await supabase
    .from(env.SUPABASE_FUNCTIONS_TABLE)
    .update({ alias })
    .eq('id', id);

  if (error) {
    logError(error);
    return null;
  }
  return true;
};
