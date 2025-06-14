'use server';

import { env } from '@/env';
import {
  createClient,
  createServiceRoleClent,
} from '@/services/supabase/server';
import { FunctionUpdatePayload } from '@/types';
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

export const serviceRoleSetFunctionAliasById = async ({
  id,
  alias,
}: {
  id: string;
  alias: string;
}) => {
  const supabase = await createServiceRoleClent();
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
