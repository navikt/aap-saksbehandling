import { NextRequest } from 'next/server';
import { AvklaringsbehovReferanse } from 'lib/types/oppgaveTypes';
import { avreserverOppgave } from 'lib/services/oppgaveservice/oppgaveservice';
import { logError } from 'lib/serverutlis/logger';

export async function POST(req: NextRequest) {
  try {
    const body: AvklaringsbehovReferanse = await req.json();
    const res = await avreserverOppgave(body);
    return new Response(JSON.stringify(res), { status: 200 });
  } catch (error) {
    logError('Feil ved avreservering av oppgave', error);
    return new Response(JSON.stringify({ message: JSON.stringify(error) }), { status: 500 });
  }
}
