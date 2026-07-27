import { logError } from 'lib/serverutlis/logger';
import { hentAktivitetspliktTrekk } from 'lib/services/saksbehandlingservice/saksbehandlingService';
import { isServerError } from 'lib/utils/api';
import { NextRequest, NextResponse } from 'next/server';

export async function GET(_: NextRequest, props: { params: Promise<{ saksnummer: string }> }) {
  const params = await props.params;
  const res = await hentAktivitetspliktTrekk(params.saksnummer);

  if (isServerError(res)) {
    logError(`/aktivitetsplikt/trekk`, res.apiException);
  }
  return NextResponse.json(res, { status: res.status });
}
