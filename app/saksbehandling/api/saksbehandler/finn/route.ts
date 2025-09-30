import { isError } from 'lib/utils/api';
import { logError } from 'lib/serverutlis/logger';
import { søkPåSaksbehandler } from 'lib/services/oppgaveservice/oppgaveservice';
import { SaksbehandlerSøkRequest } from 'lib/types/oppgaveTypes';



export async function POST(req: Request) {
  const body: SaksbehandlerSøkRequest = await req.json();


  const saksbehandlerResponse = await søkPåSaksbehandler(body)
  if (isError(saksbehandlerResponse)) {
    logError(
      `/api/saksbehandler/finn ${saksbehandlerResponse.status}, ${saksbehandlerResponse.apiException.code}: ${saksbehandlerResponse.apiException.message}`
    );
  }
  return new Response(JSON.stringify(saksbehandlerResponse), { status: saksbehandlerResponse.status });
}