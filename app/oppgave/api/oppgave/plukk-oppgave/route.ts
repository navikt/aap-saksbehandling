import { NextRequest, NextResponse } from 'next/server';
import { PlukkOppgaveDto } from 'lib/types/oppgaveTypes';
import { plukkOppgave } from 'lib/services/oppgaveservice/oppgaveservice';
import { logError, logInfo } from 'lib/serverutlis/logger';
import { isError } from 'lib/utils/api';

export async function POST(req: NextRequest) {
  const data: PlukkOppgaveDto = await req.json().then((data) => ({ oppgaveId: data.oppgaveId, versjon: data.versjon }));
  if (data.oppgaveId === undefined || data.versjon === undefined) {
    return NextResponse.json({ message: 'Missing oppgaveId or versjon', status: 400 }, { status: 400 });
  }

  try {
    const res = await plukkOppgave(data.oppgaveId, data.versjon);
    if (isError(res)) {
      if (res.status === 401) {
        logInfo(`/api/oppgave/plukk-oppgave - 401 - ikke tilgang`, res.apiException);
      } else {
        logError(`/api/oppgave/plukk-oppgave`, res.apiException);
      }
    }
    return NextResponse.json(res, { status: res.status });
  } catch (error) {
    logError(`/api/oppgave/plukk-oppgave`, error);
    return NextResponse.json({ message: JSON.stringify(error), status: 500 }, { status: 500 });
  }
}
