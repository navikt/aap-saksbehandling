import { NextRequest, NextResponse } from 'next/server';
import { isError } from 'lib/utils/api';
import { hentFastlege } from 'lib/services/saksbehandlingservice/saksbehandlingService';
import { logError } from 'lib/serverutlis/logger';

export async function GET(_: NextRequest, props: { params: Promise<{ saksnummer: string }> }) {
  const params = await props.params;

  const res = await hentFastlege(params.saksnummer);

  if (isError(res) && res.status >= 500) {
    logError(`Feil ved henting av fastlege`, res.apiException);
  }

  return NextResponse.json(res, { status: res.status });
}
