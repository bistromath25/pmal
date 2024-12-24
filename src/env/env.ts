export const SUPABASE_URL = process.env.SUPABASE_URL as string;
export const SUPABASE_ANON_KEY = process.env.SUPABASE_ANON_KEY as string;
export const APP_BASE_URL = process.env.NEXT_PUBLIC_APP_BASE_URL as string;
export const GOOGLE_CLIENT_ID = process.env.GOOGLE_CLIENT_ID as string;
export const GOOGLE_CLIENT_SECRET = process.env.GOOGLE_CLIENT_SECRET as string;
export const GITHUB_TOKEN = process.env.GITHUB_TOKEN as string;
export const GITHUB_OWNER = process.env.GITHUB_OWNER as string;
export const GITHUB_REPO = process.env.GITHUB_REPO as string;
export const GITHUB_COMMITER_NAME = process.env.GITHUB_COMMITER_NAME as string;
export const GITHUB_COMMITER_EMAIL = process.env
  .GITHUB_COMMITER_EMAIL as string;
export const GITHUB_JS_INDEX = process.env.GITHUB_JS_INDEX as string;
export const GITHUB_ACTIONS_JS_STEP = process.env
  .GITHUB_ACTIONS_JS_STEP as string;
export const FF_USE_GITHUB_ACTIONS =
  (process.env.FF_USE_GITHUB_ACTIONS as string) === 'TRUE';
