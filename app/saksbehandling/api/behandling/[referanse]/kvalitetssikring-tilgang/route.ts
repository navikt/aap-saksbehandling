import { logError } from 'lib/serverutlis/logger';
import { hentKvalitetssikringTilgang } from 'lib/services/saksbehandlingservice/saksbehandlingService';
import { isServerError } from 'lib/utils/api';
import { NextRequest, NextResponse } from 'next/server';

export async function GET(_: NextRequest, props: { params: Promise<{ referanse: string }> }) {
  const params = await props.params;
  const res = await hentKvalitetssikringTilgang(params.referanse);
  if (isServerError(res)) {
    logError(
      `api/behandling/${params.referanse}/kvalitetssikring-tilgang ${res.status} - ${res.apiException.code}: ${res.apiException.message}`
    );
  }
  return NextResponse.json(res, { status: res.status });
}
export const dynamic = 'force-dynamic';
