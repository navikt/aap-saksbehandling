import { logError } from 'lib/serverutlis/logger';
import { hentOppgaverPåSak } from 'lib/services/oppgaveservice/oppgaveservice';
import { isError } from 'lib/utils/api';
import { NextRequest, NextResponse } from 'next/server';

export async function GET(_: NextRequest, context: { params: Promise<{ saksnummer: string }> }) {
  try {
    const res = await hentOppgaverPåSak((await context.params).saksnummer);
    if (isError(res)) {
      logError(`/api/oppgave/sak/${(await context.params).saksnummer}/hent-oppgaver-paa-sak`, res.apiException);
    }

    if (res.status === 204) {
      return NextResponse.json({ message: 'Kunne ikke hente oppgaver på sak', status: 404 }, { status: 404 });
    }
    return NextResponse.json(res, { status: res.status });
  } catch (error) {
    logError(`/api/oppgave/sak/${(await context.params).saksnummer}/hent-oppgaver-paa-sak`, error);
    return NextResponse.json({ message: JSON.stringify(error), status: 500 }, { status: 500 });
  }
}
