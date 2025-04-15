import { NextRequest } from 'next/server';

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
    return new Response(JSON.stringify(res), { status: res.status });
  } catch (error) {
    logError('Feil ved henting av køer', error);
    return new Response(JSON.stringify({ message: JSON.stringify(error), status: 500 }), { status: 500 });
  }
}
