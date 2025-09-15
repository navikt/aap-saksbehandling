import { NextRequest } from 'next/server';
import { synkroniserEnhetPåOppgave } from 'lib/services/oppgaveservice/oppgaveservice';
import { logError } from 'lib/serverutlis/logger';
import { isError } from 'lib/utils/api';
import { EnhetSynkroniseringOppgave } from 'lib/types/oppgaveTypes';

export async function POST(req: NextRequest) {
  try {
    const oppgaveId: EnhetSynkroniseringOppgave = await req.json();
    const res = await synkroniserEnhetPåOppgave(oppgaveId);
    if (isError(res)) {
      logError(`/oppgave/api/synkroniser-enhet-paa-oppgave`, res.apiException);
      return new Response(JSON.stringify(res), { status: 500 });
    }
    return new Response(JSON.stringify(res), { status: 200 });
  } catch (error) {
    logError('Feil ved synkronisering av enhet på oppgave', error);
    return new Response(JSON.stringify({ message: JSON.stringify(error) }), { status: 500 });
  }
}
