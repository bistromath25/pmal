'use server';

import { env } from '@/env';
import {
  createClient,
  createServiceRoleClent,
} from '@/services/supabase/server';
import { FunctionCreatePayload } from '@/types';
import { logError } from '@/utils';

export const createFunction = async (payload: FunctionCreatePayload) => {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from(env.SUPABASE_FUNCTIONS_TABLE)
    .insert(payload)
    .select('id')
    .single();

  if (error) {
    logError(error);
    return null;
  }
  return (data?.id as string) || null;
};

export const serviceRoleCreateFunction = async (
  payload: FunctionCreatePayload
) => {
  const supabase = await createServiceRoleClent();
  const { data, error } = await supabase
    .from(env.SUPABASE_FUNCTIONS_TABLE)
    .insert({ ...payload, anonymous: true })
    .select('id')
    .single();

  if (error) {
    logError(error);
    return null;
  }
  return (data?.id as string) || null;
};
