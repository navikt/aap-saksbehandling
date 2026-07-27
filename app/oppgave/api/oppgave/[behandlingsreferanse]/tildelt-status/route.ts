import { logError } from 'lib/serverutlis/logger';
import { hentTildeltStatus } from 'lib/services/oppgaveservice/oppgaveservice';
import { isServerError } from 'lib/utils/api';
import { NextRequest, NextResponse } from 'next/server';

export async function GET(_: NextRequest, context: { params: Promise<{ behandlingsreferanse: string }> }) {
  try {
    const res = await hentTildeltStatus((await context.params).behandlingsreferanse);
    if (isServerError(res)) {
      logError(`/api/oppgave/${(await context.params).behandlingsreferanse}/tildelt-status`, res.apiException);
    }

    if (res.status === 204) {
      return NextResponse.json({ message: 'Fant ingen oppgave på behandling', status: 404 }, { status: 404 });
    }
    return NextResponse.json(res, { status: res.status });
  } catch (error) {
    logError(`/api/oppgave/${(await context.params).behandlingsreferanse}/tildelt-status`, error);
    return NextResponse.json({ message: JSON.stringify(error), status: 500 }, { status: 500 });
  }
}
