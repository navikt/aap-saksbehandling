import { NextRequest, NextResponse } from 'next/server';
import { synkroniserEnhetPåOppgave } from 'lib/services/oppgaveservice/oppgaveservice';
import { logError } from 'lib/serverutlis/logger';
import { isError } from 'lib/utils/api';
import { EnhetSynkroniseringOppgave } from 'lib/types/oppgaveTypes';

export async function POST(req: NextRequest) {
  try {
    const data: EnhetSynkroniseringOppgave = await req.json();
    const res = await synkroniserEnhetPåOppgave(data);
    if (isError(res)) {
      logError(`/oppgave/api/synkroniser-enhet-paa-oppgave`, res.apiException);
      return NextResponse.json(res, { status: 500 });
    }
    return NextResponse.json(res, { status: 200 });
  } catch (error) {
    logError('Feil ved synkronisering av enhet på oppgave', error);
    return NextResponse.json({ message: JSON.stringify(error) }, { status: 500 });
  }
}
