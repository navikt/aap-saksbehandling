import { logError } from 'lib/serverutlis/logger';
import { mottattDokumenterLest } from 'lib/services/oppgaveservice/oppgaveservice';
import { isServerError } from 'lib/utils/api';
import { NextRequest, NextResponse } from 'next/server';
import { readRequestBody } from 'lib/serverutlis/readRequestBody';
import { DokumenterLestDto } from 'lib/types/oppgaveTypes';

export async function POST(req: NextRequest) {
  const body = await readRequestBody<DokumenterLestDto>(req);
  const res = await mottattDokumenterLest(body.behandlingRef);
  if (isServerError(res)) {
    logError(`/oppgave/api/mottatt-dokumenter-lest`, res.apiException);
  }
  return NextResponse.json(res, { status: res.status });
}
