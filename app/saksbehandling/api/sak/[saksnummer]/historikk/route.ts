import { hentSaksHistorikk } from 'lib/services/saksbehandlingservice/saksbehandlingService';
import { logError } from 'lib/serverutlis/logger';
import { isError } from 'lib/utils/api';
import { NextRequest, NextResponse } from 'next/server';

export async function GET(_: NextRequest, props: { params: Promise<{ saksnummer: string }> }) {
  const params = await props.params;
  const res = await hentSaksHistorikk(params.saksnummer);
  if (isError(res)) {
    logError(`/sak/${params.saksnummer}/historikk - ${res.apiException.code}: ${res.apiException.message}`);
  }
  return NextResponse.json(res, { status: res.status });
}
