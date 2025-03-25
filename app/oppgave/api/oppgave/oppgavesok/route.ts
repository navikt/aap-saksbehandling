import { NextRequest } from 'next/server';
import { OppgaveAvklaringsbehovKode, OppgaveBehandlingstype } from 'lib/types/oppgaveTypes';
import { oppgaveSøk } from 'lib/services/oppgaveservice/oppgaveservice';
import { logError } from 'lib/serverutlis/logger';

interface OppgavesokRequestBody {
  avklaringsbehovKoder: OppgaveAvklaringsbehovKode[];
  behandlingstyper: OppgaveBehandlingstype[];
  enheter: string[];
}
export async function POST(req: NextRequest) {
  const { avklaringsbehovKoder, enheter, behandlingstyper }: OppgavesokRequestBody = await req.json();

  try {
    const result = await oppgaveSøk(avklaringsbehovKoder, behandlingstyper, enheter);
    return new Response(JSON.stringify(result), { status: 200 });
  } catch (error) {
    logError(`/api/oppgave/oppgavesok`, error);
    return new Response(JSON.stringify({ message: JSON.stringify(error), status: 500 }), { status: 500 });
  }
}
