import { logError } from 'lib/serverutlis/logger';
import { synkroniserEnhetPåOppgave } from 'lib/services/oppgaveservice/oppgaveservice';
import { EnhetSynkroniseringOppgave } from 'lib/types/oppgaveTypes';
import { isServerError } from 'lib/utils/api';
import { NextRequest, NextResponse } from 'next/server';

export async function POST(req: NextRequest) {
  try {
    const data: EnhetSynkroniseringOppgave = await req.json();
    const res = await synkroniserEnhetPåOppgave(data);
    if (isServerError(res)) {
      logError(`/oppgave/api/synkroniser-enhet-paa-oppgave`, res.apiException);
    }
    return NextResponse.json(res, { status: res.status });
  } catch (error) {
    logError('Feil ved synkronisering av enhet på oppgave', error);
    return NextResponse.json({ message: JSON.stringify(error) }, { status: 500 });
  }
}
