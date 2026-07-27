import { logError } from 'lib/serverutlis/logger';
import { avreserverOppgave } from 'lib/services/oppgaveservice/oppgaveservice';
import { AvreserverOppgaveDto } from 'lib/types/oppgaveTypes';
import { isServerError } from 'lib/utils/api';
import { NextRequest, NextResponse } from 'next/server';

export async function POST(req: NextRequest) {
  try {
    const body: AvreserverOppgaveDto = await req.json();
    const res = await avreserverOppgave(body);
    if (isServerError(res)) {
      logError(`/oppgave/api/avreserver`, res.apiException);
    }
    return NextResponse.json(res, { status: res.status });
  } catch (error) {
    logError('Feil ved avreservering av oppgave', error);
    return NextResponse.json({ message: JSON.stringify(error) }, { status: 500 });
  }
}
