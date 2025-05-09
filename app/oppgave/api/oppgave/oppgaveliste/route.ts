import { NextRequest } from 'next/server';
import { hentOppgaverForFilter } from 'lib/services/oppgaveservice/oppgaveservice';
import { logError } from 'lib/serverutlis/logger';
import { isError } from 'lib/utils/api';

export async function POST(req: NextRequest) {
  const data = await req.json();
  if (!data.filterId) {
    return new Response(JSON.stringify({ message: 'filterId mangler', status: 400 }), { status: 400 });
  } else if (!data.enheter) {
    return new Response(JSON.stringify({ message: 'enheter mangler', status: 400 }), { status: 400 });
  } else if (data.veileder === undefined || data.veileder === null) {
    return new Response(JSON.stringify({ message: 'veileder mangler', status: 400 }), { status: 400 });
  } else if (data.paging === undefined) {
    return new Response(JSON.stringify({ message: 'Paging mangler', status: 400 }), { status: 400 });
  }

  try {
    const res = await hentOppgaverForFilter(data.filterId, data.enheter, data.veileder, data.paging);
    if (isError(res)) {
      logError(`/api/oppgave/oppgaveliste`, res.apiException);
    }
    return new Response(JSON.stringify(res), { status: res.status });
  } catch (error) {
    logError(`/api/oppgave/oppgaveliste`, error);
    return new Response(JSON.stringify({ message: JSON.stringify(error), status: 500 }), { status: 500 });
  }
}
