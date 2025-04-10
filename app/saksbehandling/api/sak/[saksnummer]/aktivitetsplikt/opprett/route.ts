import { NextRequest } from 'next/server';
import { opprettBruddPåAktivitetsplikten } from 'lib/services/saksbehandlingservice/saksbehandlingService';
import { logError } from 'lib/serverutlis/logger';
import { isError } from 'lib/utils/api';

export async function POST(req: NextRequest, props: { params: Promise<{ saksnummer: string }> }) {
  const params = await props.params;
  const body = await req.json();
  const res = await opprettBruddPåAktivitetsplikten(params.saksnummer, body);
  if (isError(res)) {
    logError(
      `/sak/${params.saksnummer}/aktivitetsplikt/opprett - ${res.apiException.code}: ${res.apiException.message}`
    );
  }
  return new Response(JSON.stringify(res), { status: res.status });
}
