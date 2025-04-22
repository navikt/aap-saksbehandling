import { NextRequest } from 'next/server';
import { OppgaveAvklaringsbehovKode, OppgaveBehandlingstype } from 'lib/types/oppgaveTypes';
import { oppgaveSøk } from 'lib/services/oppgaveservice/oppgaveservice';
import { logError } from 'lib/serverutlis/logger';
import { isError } from 'lib/utils/api';

interface OppgavesokRequestBody {
  avklaringsbehovKoder: OppgaveAvklaringsbehovKode[];
  behandlingstyper: OppgaveBehandlingstype[];
  enheter: string[];
}
export async function POST(req: NextRequest) {
  const { avklaringsbehovKoder, enheter, behandlingstyper }: OppgavesokRequestBody = await req.json();

  try {
    const res = await oppgaveSøk(avklaringsbehovKoder, behandlingstyper, enheter);
    if (isError(res)) {
      logError(`/api/oppgave/oppgavesok`, res.apiException);
    }
    return new Response(JSON.stringify(res), { status: res.status });
  } catch (error) {
    logError(`/api/oppgave/oppgavesok`, error);
    return new Response(JSON.stringify({ message: JSON.stringify(error), status: 500 }), { status: 500 });
  }
}
