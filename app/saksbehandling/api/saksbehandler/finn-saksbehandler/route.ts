import { søkPåSaksbehandler } from 'lib/services/oppgaveservice/oppgaveservice';
import { SaksbehandlerSøkRequest } from 'lib/types/oppgaveTypes';
import { NextResponse } from 'next/server';
import { readRequestBody } from 'lib/serverutlis/readRequestBody';

export async function POST(req: Request) {
  const body = await readRequestBody<SaksbehandlerSøkRequest>(req);

  const saksbehandlerResponse = await søkPåSaksbehandler({
    søketekst: body.søketekst,
    oppgaver: body.oppgaver,
    enheter: body.enheter,
  });

  return NextResponse.json(saksbehandlerResponse, { status: saksbehandlerResponse.status });
}
