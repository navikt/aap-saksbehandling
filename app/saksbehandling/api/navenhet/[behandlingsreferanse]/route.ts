import { NavEnhetRequest } from 'lib/types/types';
import { hentAlleNavEnheter } from 'lib/services/saksbehandlingservice/saksbehandlingService';
import { logError } from 'lib/serverutlis/logger';
import { isError } from 'lib/utils/api';

export async function POST(req: Request, props: { params: Promise<{ behandlingsreferanse: string }> }) {
  const body: NavEnhetRequest = await req.json();
  const params = await props.params;

  const navEnheterResponse = await hentAlleNavEnheter(params.behandlingsreferanse, body);
  if (isError(navEnheterResponse)) {
    logError(
      `/api/behandling/${params.behandlingsreferanse}/navenheter/ ${navEnheterResponse.status}, ${navEnheterResponse.apiException.code}: ${navEnheterResponse.apiException.message}`
    );
  }
  return new Response(JSON.stringify(navEnheterResponse), { status: navEnheterResponse.status });
}
