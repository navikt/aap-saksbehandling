import { NextRequest } from 'next/server';
import { logError } from '@navikt/aap-felles-utils';
import { hentAntallOppgaver } from 'lib/services/oppgaveservice/oppgaveservice';

export async function POST(req: NextRequest) {
  const behandlingstype = await req.json().then((data) => data.behandlingstype);

  try {
    const result = await hentAntallOppgaver(behandlingstype);
    return new Response(JSON.stringify(result), { status: 200 });
  } catch (error) {
    logError(`/api/oppgave/antall-oppgaver`, error);
    return new Response(JSON.stringify({ message: JSON.stringify(error), status: 500 }), { status: 500 });
  }
}
