import { hentMineOppgaver } from 'lib/services/oppgaveservice/oppgaveservice';
import { logError } from 'lib/serverutlis/logger';
import { isError } from 'lib/utils/api';
import { NextRequest, NextResponse } from 'next/server';
import { hentMineOppgaverQueryParams } from 'lib/utils/request';

export async function GET(req: NextRequest) {
  const { sortBy, sortOrder } = hentMineOppgaverQueryParams(req);
  try {
    const res = await hentMineOppgaver({ sortBy, sortOrder });
    if (isError(res)) {
      logError(`/api/oppgave/mine-oppgaver`, res.apiException);
    }
    return NextResponse.json(res, { status: res.status });
  } catch (error) {
    logError(`/api/oppgave/mine-oppgaver`, error);
    return NextResponse.json({ message: JSON.stringify(error), status: 500 }, { status: 500 });
  }
}
