import { NextRequest } from 'next/server';
import { hentAktivitetspliktTrekk } from 'lib/services/saksbehandlingservice/saksbehandlingService';
import { isError } from 'lib/utils/api';
import { logError } from 'lib/serverutlis/logger';

export async function GET(_: NextRequest, props: { params: Promise<{ saksnummer: string }> }) {
  const params = await props.params;
  const res = await hentAktivitetspliktTrekk(params.saksnummer);

  if (isError(res)) {
    logError(`/aktivitetsplikt/trekk`, res.apiException);
  }
  return new Response(JSON.stringify(res), { status: res.status });
}
