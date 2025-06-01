'use server';

import { createClient } from '@/services/supabase/server';

export const signout = async () => {
  const supabase = await createClient();
  const { error } = await supabase.auth.signOut();
  if (error) {
    throw new Error(error.message);
  }
  return true;
};
