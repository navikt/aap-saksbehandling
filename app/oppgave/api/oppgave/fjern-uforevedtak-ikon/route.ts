import { logError } from 'lib/serverutlis/logger';
import { fjernUføreVedtakIkon } from 'lib/services/oppgaveservice/oppgaveservice';
import { UføreVedtak } from 'lib/types/oppgaveTypes';
import { isServerError } from 'lib/utils/api';
import { NextRequest, NextResponse } from 'next/server';
import { readRequestBody } from 'lib/serverutlis/readRequestBody';

export async function POST(req: NextRequest) {
  const body = await readRequestBody<UføreVedtak>(req);
  const res = await fjernUføreVedtakIkon(body);
  if (isServerError(res)) {
    logError(`/oppgave/api/fjern-uførevedtak-ikon`, res.apiException);
  }
  return NextResponse.json(res, { status: res.status });
}
