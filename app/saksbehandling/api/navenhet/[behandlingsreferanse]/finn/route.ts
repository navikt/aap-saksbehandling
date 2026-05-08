import { NavEnhetRequest } from 'lib/types/types';
import { hentAlleNavEnheter } from 'lib/services/saksbehandlingservice/saksbehandlingService';
import { logError } from 'lib/serverutlis/logger';
import { isError } from 'lib/utils/api';
import { NextResponse } from 'next/server';
import { hentBrukerInformasjon } from 'lib/services/azure/azureUserService';

export async function POST(req: Request, props: { params: Promise<{ behandlingsreferanse: string }> }) {
  const body: NavEnhetRequest = await req.json();
  const params = await props.params;
  const brukerInformasjon = await hentBrukerInformasjon();

  const res = await hentAlleNavEnheter(params.behandlingsreferanse, body, brukerInformasjon.NAVident);
  if (isError(res) && res.status >= 500) {
    logError(
      `/api/navenhet/${params.behandlingsreferanse}/finn/ ${res.status}, ${res.apiException.code}: ${res.apiException.message}`
    );
  }
  return NextResponse.json(res, { status: res.status });
}
