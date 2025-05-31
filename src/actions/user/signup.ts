'use server';

import { env } from '@/env';
import { createClient } from '@/services/supabase/server';
import { logError } from '@/utils';
import { AuthResponse } from '@supabase/supabase-js';

export const signup = async ({
  email,
  password,
}: {
  email: string;
  password: string;
}): Promise<{
  user: AuthResponse['data']['user'] | null;
  error?: string;
}> => {
  const supabase = await createClient();
  if (!supabase) {
    throw new Error('No supabase client found!');
  }

  try {
    const { data, error } = await supabase.auth.signUp({
      email,
      password,
    });

    if (error) {
      logError(error);
      return {
        user: null,
        error: error.message,
      };
    }

    const user = data.user;
    if (!user || !user.id || !user.email) {
      return {
        user: null,
        error: 'Missing required user information',
      };
    }

    try {
      const { error } = await supabase.from(env.SUPABASE_USERS_TABLE).insert([
        {
          uid: user.id,
          email: user.email,
          name: email.split('@')[0],
        },
      ]);

      if (error) {
        throw error;
      }
    } catch (error: any) {
      logError(error);
      return {
        user: null,
        error: error.message,
      };
    }

    return {
      user,
    };
  } catch (error: any) {
    logError(error);
    return {
      user: null,
      error: error.message,
    };
  }
};
