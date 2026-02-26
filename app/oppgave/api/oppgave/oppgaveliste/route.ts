import { NextRequest, NextResponse } from 'next/server';
import { hentOppgaverForFilter } from 'lib/services/oppgaveservice/oppgaveservice';
import { logError, logWarning } from 'lib/serverutlis/logger';
import { isError } from 'lib/utils/api';
import { OppgavelisteRequest } from 'lib/types/oppgaveTypes';

export async function POST(req: NextRequest) {
  const data: OppgavelisteRequest = await req.json();
  if (!data.filterId) {
    return NextResponse.json({ message: 'filterId mangler', status: 400 }, { status: 400 });
  } else if (!data.enheter) {
    return NextResponse.json({ message: 'enheter mangler', status: 400 }, { status: 400 });
  } else if (data.veileder === undefined || data.veileder === null) {
    return NextResponse.json({ message: 'veileder mangler', status: 400 }, { status: 400 });
  } else if (data.paging === undefined) {
    return NextResponse.json({ message: 'Paging mangler', status: 400 }, { status: 400 });
  }

  try {
    const payload: OppgavelisteRequest = {
      enheter: data.enheter,
      paging: data.paging,
      veileder: data.veileder,
      filterId: data.filterId,
      sortering: data.sortering,
      kunLedigeOppgaver: data.kunLedigeOppgaver,
      utvidetFilter: data.utvidetFilter,
    };
    const res = await hentOppgaverForFilter(payload);
    if (isError(res)) {
      logWarning(`/api/oppgave/oppgaveliste`, res.apiException);
    }
    return NextResponse.json(res, { status: res.status });
  } catch (error) {
    logError(`/api/oppgave/oppgaveliste`, error);
    return NextResponse.json({ message: JSON.stringify(error), status: 500 }, { status: 500 });
  }
}
