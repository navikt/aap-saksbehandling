import { NextRequest, NextResponse } from 'next/server';
import { hentOppgave } from 'lib/services/oppgaveservice/oppgaveservice';
import { isError } from 'lib/utils/api';
import { logError } from 'lib/serverutlis/logger';

export async function GET(_: NextRequest, context: { params: Promise<{ behandlingsreferanse: string }> }) {
  try {
    const res = await hentOppgave((await context.params).behandlingsreferanse);
    if (isError(res)) {
      logError(`/api/oppgave/${(await context.params).behandlingsreferanse}/hent`, res.apiException);
    }

    if (res.status === 204) {
      return NextResponse.json({ message: 'Oppgaven er utilgjengelig', status: 404 }, { status: 404 });
    }
    return NextResponse.json(res, { status: res.status });
  } catch (error) {
    logError(`/api/oppgave/${(await context.params).behandlingsreferanse}/hent`, error);
    return NextResponse.json({ message: JSON.stringify(error), status: 500 }, { status: 500 });
  }
}
