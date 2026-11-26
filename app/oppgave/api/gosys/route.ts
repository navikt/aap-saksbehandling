import { NextRequest, NextResponse } from 'next/server';
import { hentOppgaver } from 'lib/services/gosysservice/gosysService';
import { FinnGosysOppgaverQueryParams } from 'lib/types/gosysTypes';
import { logError, logWarning } from 'lib/serverutlis/logger';
import { isError } from 'lib/utils/api';

export async function POST(req: NextRequest) {
  const request: FinnGosysOppgaverQueryParams = await req.json();

  try {
    const res = await hentOppgaver(request);
    if (isError(res)) {
      logWarning('/oppgave/api/gosys', res.apiException);
    }
    return NextResponse.json(res, { status: res.status });
  } catch (error) {
    logError('/oppgave/api/gosys', error);
    return NextResponse.json(
      { type: 'ERROR', status: 500, apiException: { message: 'Kunne ikke hente Gosys-oppgaver.' } },
      { status: 500 }
    );
  }
}
