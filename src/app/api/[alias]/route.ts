import { getFunctionByAlias } from '@/utils/supabase';
import { executeFile, getFunctionName } from '@/utils/utils';
import * as fs from 'fs';
import { TMP_FILE_STORAGE_LOCATION } from '@/utils/env';

export async function POST(req: Request) {
  try {
    const url = new URL(req.url);
    const params = new URLSearchParams(url.search);
    const alias = url.pathname.split('/api/')[1];
    var f = await getFunctionByAlias(alias);
    if (f && f.fun) {
      const funName = getFunctionName(f.fun);
      const content =
        f.fun +
        `\nconsole.log(${funName}(${Object.values(Object.fromEntries(params)).map((x) => `'${x}'`)}))`;
      const file = `${TMP_FILE_STORAGE_LOCATION}/${alias}.js`;
      fs.writeFileSync(file, content);
      const result = await executeFile(file);
      fs.unlinkSync(file);
      return new Response(JSON.stringify({ result }), { status: 200 });
    }
    return new Response(null, { status: 500 });
  } catch (error) {
    return new Response(null, { status: 500 });
  }
}
