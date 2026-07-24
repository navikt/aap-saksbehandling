import { logError } from 'lib/serverutlis/logger';
import { fjernHelseopplysningIkon } from 'lib/services/oppgaveservice/oppgaveservice';
import { isError } from 'lib/utils/api';
import { NextRequest, NextResponse } from 'next/server';

export async function POST(req: NextRequest) {
  const body: { behandlingRef: string } = await req.json();
  const res = await fjernHelseopplysningIkon(body.behandlingRef);
  if (isError(res) && res.status >= 500) {
    logError(`/oppgave/api/fjern-helseopplysning-ikon`, res.apiException);
  }
  return NextResponse.json(res, { status: res.status });
}
