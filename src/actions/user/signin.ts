'use server';

import { createClient } from '@/services/supabase/server';
import { logError } from '@/utils';

export const signin = async ({
  email,
  password,
}: {
  email: string;
  password: string;
}) => {
  const supabase = await createClient();
  if (!supabase) {
    throw new Error('No supabase client found!');
  }

  const { data: user, error } = await supabase.auth.signInWithPassword({
    email,
    password,
  });
  if (error) {
    throw new Error(error.message);
  }

  try {
    return user;
  } catch (error: any) {
    logError(error);
    return {
      error,
    };
  }
};
