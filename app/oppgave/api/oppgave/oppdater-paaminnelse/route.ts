import { NextRequest, NextResponse } from 'next/server';
import { OppdaterPåminnelseRequest } from 'lib/types/oppgaveTypes';
import { oppdaterPåminnelse } from 'lib/services/oppgaveservice/oppgaveservice';
import { isServerError } from 'lib/utils/api';
import { logError } from 'lib/serverutlis/logger';

export async function POST(req: NextRequest) {
  const body: OppdaterPåminnelseRequest = await req.json();
  const res = await oppdaterPåminnelse(body);
  if (isServerError(res)) {
    logError(`/oppgave/api/oppdater-paaminnelse`, res.apiException);
  }
  return NextResponse.json(res, { status: res.status });
}
