import { logError } from 'lib/serverutlis/logger';
import { hentMineSisteOppgaver } from 'lib/services/oppgaveservice/oppgaveservice';
import { isServerError } from 'lib/utils/api';
import { NextResponse } from 'next/server';

export async function GET() {
  try {
    const res = await hentMineSisteOppgaver();
    if (isServerError(res)) {
      logError(`/api/oppgave/mine-siste-oppgaver`, res.apiException);
    }
    return NextResponse.json(res, { status: res.status });
  } catch (error) {
    logError(`/api/oppgave/mine-siste-oppgaver`, error);
    return NextResponse.json({ message: JSON.stringify(error), status: 500 }, { status: 500 });
  }
}
