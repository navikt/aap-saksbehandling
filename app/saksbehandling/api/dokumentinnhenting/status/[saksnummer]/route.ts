import { logError } from 'lib/serverutlis/logger';
import { hentAlleDialogmeldingerPåSak } from 'lib/services/saksbehandlingservice/saksbehandlingService';
import { isServerError } from 'lib/utils/api';
import { NextRequest, NextResponse } from 'next/server';

export async function GET(_: NextRequest, props: { params: Promise<{ saksnummer: string }> }) {
  const params = await props.params;

  const res = await hentAlleDialogmeldingerPåSak(params.saksnummer);

  if (isServerError(res)) {
    logError(`/dokumentinnhenting/behandleroppslag`, res.apiException);
  }

  return NextResponse.json(res, { status: res.status });
}
