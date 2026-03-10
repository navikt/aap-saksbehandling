import { søkPåSaksbehandler } from 'lib/services/oppgaveservice/oppgaveservice';
import { SaksbehandlerSøkRequest } from 'lib/types/oppgaveTypes';
import { NextResponse } from 'next/server';

export async function POST(req: Request) {
  const body: SaksbehandlerSøkRequest = await req.json();

  const saksbehandlerResponse = await søkPåSaksbehandler({
    søketekst: body.søketekst,
    oppgaver: body.oppgaver,
    enheter: body.enheter,
  });
  // const saksbehandlerResponse = {
  //   type: 'SUCCESS',
  //   status: 200,
  //   data: {
  //     saksbehandlere: [
  //       { navn: 'hei heisen', navIdent: 'aGDLG' },
  //       { navn: 'godag godagsen', navIdent: 'LKHLKL' },
  //       { navn: 'hallo hallosen', navIdent: 'GDGSSFkk' },
  //     ],
  //   },
  // };

  return NextResponse.json(saksbehandlerResponse, { status: saksbehandlerResponse.status });
}
