import { NextRequest } from 'next/server';
import { PlukkOppgaveDto } from 'lib/types/oppgaveTypes';
import { plukkOppgave } from 'lib/services/oppgaveservice/oppgaveservice';
import { logError } from 'lib/serverutlis/logger';
import { isError } from 'lib/utils/api';

export async function POST(req: NextRequest) {
  const data: PlukkOppgaveDto = await req.json().then((data) => ({ oppgaveId: data.oppgaveId, versjon: data.versjon }));
  if (data.oppgaveId === undefined || data.versjon === undefined) {
    return new Response(JSON.stringify({ message: 'Missing oppgaveId or versjon', status: 400 }), { status: 400 });
  }

  try {
    const res = await plukkOppgave(data.oppgaveId, data.versjon);
    if (isError(res)) {
      logError(`/api/oppgave/plukk-oppgave`, res.apiException);
    }
    return new Response(JSON.stringify(res), { status: res.status });
  } catch (error) {
    logError(`/api/oppgave/plukk-oppgave`, error);
    return new Response(JSON.stringify({ message: JSON.stringify(error), status: 500 }), { status: 500 });
  }
}
