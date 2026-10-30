import { logError } from 'lib/serverutlis/logger';
import { hentAlleNavEnheter } from 'lib/services/saksbehandlingservice/saksbehandlingService';
import { NavEnhetRequest } from 'lib/types/types';
import { isServerError } from 'lib/utils/api';
import { NextResponse } from 'next/server';
import { readRequestBody } from 'lib/serverutlis/readRequestBody';

export async function POST(req: Request, props: { params: Promise<{ behandlingsreferanse: string }> }) {
  const body = await readRequestBody<NavEnhetRequest>(req);
  const params = await props.params;

  const res = await hentAlleNavEnheter(params.behandlingsreferanse, body);
  if (isServerError(res)) {
    logError(
      `/api/navenhet/${params.behandlingsreferanse}/finn/ ${res.status}, ${res.apiException.code}: ${res.apiException.message}`
    );
  }
  return NextResponse.json(res, { status: res.status });
}
