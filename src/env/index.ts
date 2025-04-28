const variables = [
  'SUPABASE_URL',
  'SUPABASE_ANON_KEY',
  'SUPABASE_USERS_TABLE',
  'SUPABASE_FUNCTIONS_TABLE',
  'SUPABASE_TIME_ENTRIES_TABLE',
  'NEXT_PUBLIC_APP_BASE_URL',
  'GOOGLE_CLIENT_ID',
  'GOOGLE_CLIENT_SECRET',
  'GITHUB_TOKEN',
  'GITHUB_OWNER',
  'GITHUB_REPO',
  'GITHUB_COMMITER_NAME',
  'GITHUB_COMMITER_EMAIL',
  'GITHUB_JS_INDEX',
  'GITHUB_ACTIONS_JS_STEP',
  'FF_USE_GITHUB_ACTIONS',
  'NEXT_PUBLIC_FF_ONLY_JS_FUNCTIONS',
] as const;

if (typeof window === 'undefined') {
  for (const variable of variables) {
    if (!process.env[variable]) {
      throw new Error(`Missing environment variable ${variable}`);
    }
  }
}

export const env = {
  SUPABASE_URL: process.env.SUPABASE_URL as string,
  SUPABASE_ANON_KEY: process.env.SUPABASE_ANON_KEY as string,
  SUPABASE_USERS_TABLE: process.env.SUPABASE_USERS_TABLE as string,
  SUPABASE_FUNCTIONS_TABLE: process.env.SUPABASE_FUNCTIONS_TABLE as string,
  SUPABASE_TIME_ENTRIES_TABLE: process.env
    .SUPABASE_TIME_ENTRIES_TABLE as string,
  APP_BASE_URL: process.env.NEXT_PUBLIC_APP_BASE_URL as string,
  GOOGLE_CLIENT_ID: process.env.GOOGLE_CLIENT_ID as string,
  GOOGLE_CLIENT_SECRET: process.env.GOOGLE_CLIENT_SECRET as string,
  GITHUB_TOKEN: process.env.GITHUB_TOKEN as string,
  GITHUB_OWNER: process.env.GITHUB_OWNER as string,
  GITHUB_REPO: process.env.GITHUB_REPO as string,
  GITHUB_COMMITER_NAME: process.env.GITHUB_COMMITER_NAME as string,
  GITHUB_COMMITER_EMAIL: process.env.GITHUB_COMMITER_EMAIL as string,
  GITHUB_JS_INDEX: process.env.GITHUB_JS_INDEX as string,
  GITHUB_ACTIONS_JS_STEP: process.env.GITHUB_ACTIONS_JS_STEP as string,
  FF_USE_GITHUB_ACTIONS:
    (process.env.FF_USE_GITHUB_ACTIONS as string) === 'TRUE',
  FF_ONLY_JS_FUNCTIONS:
    (process.env.NEXT_PUBLIC_FF_ONLY_JS_FUNCTIONS as string) === 'TRUE',
};
