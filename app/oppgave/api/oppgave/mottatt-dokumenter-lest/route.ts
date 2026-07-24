import { logError } from 'lib/serverutlis/logger';
import { mottattDokumenterLest } from 'lib/services/oppgaveservice/oppgaveservice';
import { isError } from 'lib/utils/api';
import { NextRequest, NextResponse } from 'next/server';

export async function POST(req: NextRequest) {
  const body: { behandlingRef: string } = await req.json();
  const res = await mottattDokumenterLest(body.behandlingRef);
  if (isError(res) && res.status >= 500) {
    logError(`/oppgave/api/mottatt-dokumenter-lest`, res.apiException);
  }
  return NextResponse.json(res, { status: res.status });
}
