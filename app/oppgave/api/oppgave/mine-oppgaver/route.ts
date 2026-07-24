import { logError } from 'lib/serverutlis/logger';
import { hentMineOppgaverQueryParams } from 'lib/serverutlis/mine-oppgaver';
import { hentMineOppgaver } from 'lib/services/oppgaveservice/oppgaveservice';
import { isServerError } from 'lib/utils/api';
import { NextRequest, NextResponse } from 'next/server';

export async function GET(req: NextRequest) {
  const params = hentMineOppgaverQueryParams(req);
  try {
    const res = await hentMineOppgaver({
      sortby: params?.sortby,
      sortorder: params?.sortorder,
      kunPaaVent: params?.kunPaaVent,
    });
    if (isServerError(res)) {
      logError(`/api/oppgave/mine-oppgaver`, res.apiException);
    }
    return NextResponse.json(res, { status: res.status });
  } catch (error) {
    logError(`/api/oppgave/mine-oppgaver`, error);
    return NextResponse.json({ message: JSON.stringify(error), status: 500 }, { status: 500 });
  }
}
