import { NextRequest, NextResponse } from 'next/server';
import { hentAntallOppgaver } from 'lib/services/oppgaveservice/oppgaveservice';
import { logError } from 'lib/serverutlis/logger';
import { isError } from 'lib/utils/api';

export async function POST(req: NextRequest) {
  const behandlingstype = await req.json().then((data) => data.behandlingstype);

  try {
    const res = await hentAntallOppgaver(behandlingstype);
    if (isError(res)) {
      logError(`/api/oppgave/antall-oppgaver`, res.apiException);
    }
    return NextResponse.json(res, { status: res.status });
  } catch (error) {
    logError(`/api/oppgave/antall-oppgaver`, error);
    return NextResponse.json({ message: JSON.stringify(error), status: 500 }, { status: 500 });
  }
}
