import { logInfo } from 'lib/serverutlis/logger';
import { opprettDummySakTest } from 'lib/services/saksbehandlingservice/saksbehandlingService';
import { isServerError } from 'lib/utils/api';
import { revalidatePath } from 'next/cache';
import { NextRequest, NextResponse } from 'next/server';
import { readRequestBody } from 'lib/serverutlis/readRequestBody';
import { OpprettDummySakDto } from 'lib/types/types';

export async function POST(req: NextRequest) {
  const body = await readRequestBody<OpprettDummySakDto>(req);

  const res = await opprettDummySakTest(body);
  if (isServerError(res)) {
    logInfo(`/test/opprettDummySak/, status: ${res.status}, message: ${res.apiException.message}`);
  }
  revalidatePath('/saksoversikt', 'page');
  return NextResponse.json(res, { status: res.status });
}
