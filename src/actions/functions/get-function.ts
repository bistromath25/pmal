'use server';

import { env } from '@/env';
import {
  createClient,
  createServiceRoleClent,
} from '@/services/supabase/server';
import { FunctionRecord } from '@/types';
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

export const getFunctionByAlias = async (alias: string) => {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from(env.SUPABASE_FUNCTIONS_TABLE)
    .select('*')
    .eq('alias', alias);
  if (error) {
    logError(error);
    return null;
  }
  return data?.length ? (data[0] as FunctionRecord) : null;
};

export const serviceRoleGetFunctionByAlias = async (alias: string) => {
  const supabase = await createServiceRoleClent();
  const { data, error } = await supabase
    .from(env.SUPABASE_FUNCTIONS_TABLE)
    .select('*')
    .eq('alias', alias);
  if (error) {
    logError(error);
    return null;
  }
  return data?.length ? (data[0] as FunctionRecord) : null;
};

export const serviceRoleUpdateFunctionTotalCalls = async ({
  id,
  total_calls,
}: {
  id: string;
  total_calls: number;
}) => {
  const supabase = await createServiceRoleClent();
  const { error } = await supabase
    .from(env.SUPABASE_FUNCTIONS_TABLE)
    .update({ total_calls })
    .eq('id', id);
  if (error) {
    logError(error);
    return null;
  }
  return true;
};
