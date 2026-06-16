import { logError } from 'lib/serverutlis/logger';
import { hentAlleDialogmeldingerPåSak } from 'lib/services/saksbehandlingservice/saksbehandlingService';
import { NextRequest, NextResponse } from 'next/server';
import { isError } from 'lib/utils/api';

export async function GET(_: NextRequest, props: { params: Promise<{ saksnummer: string }> }) {
  const params = await props.params;

  const res = await hentAlleDialogmeldingerPåSak(params.saksnummer);

  if (isError(res) && res.status >= 500) {
    logError(`/dokumentinnhenting/behandleroppslag`, res.apiException);
  }

  return NextResponse.json(res, { status: res.status });
}
