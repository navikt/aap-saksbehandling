import { NextRequest, NextResponse } from 'next/server';
import { NesteOppgaveRequestBody } from 'lib/types/oppgaveTypes';
import { velgNesteOppgave } from 'lib/services/oppgaveservice/oppgaveservice';
import { logError } from 'lib/serverutlis/logger';
import { isError } from 'lib/utils/api';

export async function POST(req: NextRequest) {
  const data: NesteOppgaveRequestBody = await req
    .json()
    .then((data) => ({ filterId: data.filterId, enheter: data.enheter }));
  if (data.filterId === undefined || data.enheter === undefined) {
    return NextResponse.json({ message: 'Missing filterid or enheter', status: 400 }, { status: 400 });
  }

  try {
    const res = await velgNesteOppgave(data);
    if (isError(res)) {
      logError(`/api/oppgave/neste`, res.apiException);
    }

    if (res.status === 204) {
      return new NextResponse(null, { status: 204 });
    }
    return NextResponse.json(res, { status: res.status });
  } catch (error) {
    logError(`/api/oppgave/neste`, error);
    return NextResponse.json({ message: JSON.stringify(error), status: 500 }, { status: 500 });
  }
}
