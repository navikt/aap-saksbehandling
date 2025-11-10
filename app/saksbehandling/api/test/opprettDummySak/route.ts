import { opprettDummySakTest } from 'lib/services/saksbehandlingservice/saksbehandlingService';
import { NextRequest, NextResponse } from 'next/server';
import { revalidatePath } from 'next/cache';
import { logInfo } from 'lib/serverutlis/logger';
import { isError } from 'lib/utils/api';

export async function POST(req: NextRequest) {
  const body = await req.json();

  const res = await opprettDummySakTest(body);
  if (isError(res)) {
    logInfo(`/test/opprettDummySak/, status: ${res.status}, message: ${res.apiException.message}`);
  }
  revalidatePath('/saksoversikt', 'page');
  return NextResponse.json(res, { status: res.status });
}
