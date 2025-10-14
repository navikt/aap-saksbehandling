import { søkPåSaksbehandler } from 'lib/services/oppgaveservice/oppgaveservice';
import { SaksbehandlerSøkRequest } from 'lib/types/oppgaveTypes';

export async function POST(req: Request) {
  const body: SaksbehandlerSøkRequest = await req.json();

  const saksbehandlerResponse = await søkPåSaksbehandler(body);
  return new Response(JSON.stringify(saksbehandlerResponse), { status: saksbehandlerResponse.status });
}
