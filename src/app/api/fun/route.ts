import { NextRequest, NextResponse } from 'next/server';
import {
  serviceRoleCreateFunction,
  serviceRoleSetFunctionAliasById,
} from '@/actions/functions';
import { getAlias, logError } from '@/utils';

export async function POST(req: NextRequest) {
  try {
    const { language, code } = await req.json();
    const id = await serviceRoleCreateFunction({
      language,
      code,
    });
    const alias = getAlias(id!);
    await serviceRoleSetFunctionAliasById({ id: id!, alias });
    return NextResponse.json({ data: { alias } }, { status: 201 });
  } catch (error) {
    logError(error);
    return NextResponse.json({ error }, { status: 500 });
  }
}
