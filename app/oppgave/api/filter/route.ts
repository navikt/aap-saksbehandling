import { NextRequest, NextResponse } from 'next/server';

import { hentKøer } from 'lib/services/oppgaveservice/oppgaveservice';
import { logError } from 'lib/serverutlis/logger';
import { isError } from 'lib/utils/api';

export async function GET(req: NextRequest) {
  const enheter = req.nextUrl.searchParams.getAll('enheter');

  try {
    const res = await hentKøer(enheter);
    if (isError(res)) {
      logError('oppgave/api/filter', res.apiException);
    }
    return NextResponse.json(res, { status: res.status });
  } catch (error) {
    logError('Feil ved henting av køer', error);
    return NextResponse.json({ message: JSON.stringify(error), status: 500 }, { status: 500 });
  }
}
