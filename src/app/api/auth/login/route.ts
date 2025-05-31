import { NextRequest, NextResponse } from 'next/server';
import { loginUser } from '@/services/supabase';

export async function POST(req: NextRequest) {
  try {
    const { email, password } = await req.json();
    const user = await loginUser({ email, password });
    return NextResponse.json({ user }, { status: 200 });
  } catch (error) {
    return NextResponse.json({ error }, { status: 500 });
  }
}
