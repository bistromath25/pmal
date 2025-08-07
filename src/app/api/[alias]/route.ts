import { NextRequest, NextResponse } from 'next/server';
import { serviceRoleCreateExecutionEntry } from '@/actions/execution-entries/create-execution-entry';
import {
  serviceRoleGetFunctionByAlias,
  serviceRoleUpdateFunctionTotalCalls,
} from '@/actions/functions';
import { env } from '@/env';
import { runFunction } from '@/services/github';
import { getFunction, logError } from '@/utils';

export async function GET(req: NextRequest) {
  try {
    const params = req.nextUrl.searchParams;
    const alias = req.nextUrl.pathname.split('/api/')[1];
    const fun = await serviceRoleGetFunctionByAlias(alias);
    if (!fun) {
      return NextResponse.json(
        { error: 'Function does not exist' },
        { status: 404 }
      );
    }

    const { code, language, total_calls } = fun;

    let result;
    const startDate = new Date();
    if (code) {
      if (env.FF_USE_GITHUB_ACTIONS === 'true') {
        try {
          result = await runFunction({
            alias,
            code,
            language,
            params,
          });
        } catch (error) {
          logError(error);
          return NextResponse.json(
            { error: 'Execution timed out' },
            { status: 500 }
          );
        }
      } else {
        const funCode = getFunction(code);

        if (funCode) {
          result = funCode(...Object.values(Object.fromEntries(params)));
        }
      }

      const endDate = new Date();
      const time = endDate.getTime() - startDate.getTime();

      await serviceRoleUpdateFunctionTotalCalls({
        id: fun.id,
        total_calls: total_calls + 1,
      });

      await serviceRoleCreateExecutionEntry({
        function_id: fun.id,
        user_id: fun.user_id,
        code,
        language,
        query: params.toString(),
        started_at: startDate,
        ended_at: endDate,
        time,
        result,
      });

      return NextResponse.json(
        {
          data: {
            result,
            total_calls: total_calls + 1,
          },
        },
        { status: 200 }
      );
    }

    return NextResponse.json(
      {
        error: 'Function is empty',
      },
      { status: 400 }
    );
  } catch (error) {
    logError(error);
    return NextResponse.json({ error }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  return GET(req);
}
