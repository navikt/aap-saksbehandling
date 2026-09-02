import { NextRequest, NextResponse } from 'next/server';
import { PlukkOppgaveRequest } from 'lib/types/oppgaveTypes';
import { plukkOppgave } from 'lib/services/oppgaveservice/oppgaveservice';
import { logError } from 'lib/serverutlis/logger';
import { isServerError } from 'lib/utils/api';

export async function POST(req: NextRequest) {
  const data: PlukkOppgaveRequest = await req
    .json()
    .then((data) => ({ oppgaveId: data.oppgaveId, versjon: data.versjon }));
  if (data.oppgaveId === undefined || data.versjon === undefined) {
    return NextResponse.json({ message: 'Missing oppgaveId or versjon', status: 400 }, { status: 400 });
  }

  try {
    const res = await plukkOppgave(data.oppgaveId, data.versjon);
    if (isServerError(res)) {
      logError(`/api/oppgave/plukk-oppgave`, res.apiException);
    }
    return NextResponse.json(res, { status: res.status });
  } catch (error) {
    logError(`/api/oppgave/plukk-oppgave`, error);
    return NextResponse.json({ message: JSON.stringify(error), status: 500 }, { status: 500 });
  }
}
