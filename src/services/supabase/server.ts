'use server';

import { cookies } from 'next/headers';
import { env } from '@/env';
import { createServerClient } from '@supabase/ssr';

export async function createClient() {
  const cookieStore = await cookies();

  return createServerClient(env.SUPABASE_URL!, env.SUPABASE_ANON_KEY!, {
    cookies: {
      getAll() {
        return cookieStore.getAll();
      },
      setAll(cookiesToSet) {
        try {
          cookiesToSet.forEach(({ name, value, options }) =>
            cookieStore.set(name, value, options)
          );
        } catch {}
      },
    },
  });
}

export async function createServiceRoleClent() {
  return createServerClient(env.SUPABASE_URL!, env.SUPABASE_SERVICE_ROLE_KEY!, {
    cookies: {
      get() {
        return undefined;
      },
      set() {},
      remove() {},
    },
  });
}
