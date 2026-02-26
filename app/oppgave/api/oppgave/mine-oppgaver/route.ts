import { hentMineOppgaver } from 'lib/services/oppgaveservice/oppgaveservice';
import { logError } from 'lib/serverutlis/logger';
import { isError } from 'lib/utils/api';
import { NextRequest, NextResponse } from 'next/server';
import { hentMineOppgaverQueryParams } from 'lib/utils/request';

export async function GET(req: NextRequest) {
  const params = hentMineOppgaverQueryParams(req);
  try {
    const res = await hentMineOppgaver({
      sortby: params?.sortby,
      sortorder: params?.sortorder,
      kunPaaVent: params?.kunPaaVent,
    });
    if (isError(res)) {
      logError(`/api/oppgave/mine-oppgaver`, res.apiException);
    }
    return NextResponse.json(res, { status: res.status });
  } catch (error) {
    logError(`/api/oppgave/mine-oppgaver`, error);
    return NextResponse.json({ message: JSON.stringify(error), status: 500 }, { status: 500 });
  }
}
