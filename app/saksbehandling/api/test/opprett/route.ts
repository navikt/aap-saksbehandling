import { logError } from 'lib/serverutlis/logger';
import { opprettDummySakDev } from 'lib/services/saksbehandlingservice/saksbehandlingService';
import { isServerError } from 'lib/utils/api';
import { revalidatePath } from 'next/cache';
import { NextRequest, NextResponse } from 'next/server';
import { readRequestBody } from 'lib/serverutlis/readRequestBody';
import { OpprettTestcase } from 'lib/types/types';

export async function POST(req: NextRequest) {
  const body = await readRequestBody<OpprettTestcase>(req);

  const res = await opprettDummySakDev(body);
  if (isServerError(res)) {
    logError(`/test/opprett/, status: ${res.status}, message: ${res.apiException.message}`);
  }
  revalidatePath('/saksoversikt', 'page');
  return NextResponse.json(res, { status: res.status });
}
