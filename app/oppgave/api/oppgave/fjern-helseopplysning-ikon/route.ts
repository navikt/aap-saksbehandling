import { NextRequest, NextResponse } from 'next/server';
import { fjernHelseopplysningIkon } from 'lib/services/oppgaveservice/oppgaveservice';
import { logError } from 'lib/serverutlis/logger';
import { isError } from 'lib/utils/api';

export async function POST(req: NextRequest) {
  const body: { behandlingRef: string } = await req.json();
  const res = await fjernHelseopplysningIkon(body.behandlingRef);
  if (isError(res)) {
    logError(`/oppgave/api/fjern-helseopplysning-ikon`, res.apiException);
  }
  return NextResponse.json(res, { status: res.status });
}
