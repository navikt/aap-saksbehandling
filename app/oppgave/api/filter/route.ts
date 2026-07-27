import { logError } from 'lib/serverutlis/logger';
import { hentKøer } from 'lib/services/oppgaveservice/oppgaveservice';
import { isServerError } from 'lib/utils/api';
import { NextRequest, NextResponse } from 'next/server';

export async function GET(req: NextRequest) {
  const enheter = req.nextUrl.searchParams.getAll('enheter');

  try {
    const res = await hentKøer(enheter);
    if (isServerError(res)) {
      logError('oppgave/api/filter', res.apiException);
    }
    return NextResponse.json(res, { status: res.status });
  } catch (error) {
    logError('Feil ved henting av køer', error);
    return NextResponse.json({ message: JSON.stringify(error), status: 500 }, { status: 500 });
  }
}
