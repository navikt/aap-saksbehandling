import { NextRequest } from 'next/server';
import { opprettAktivitetspliktBehandling } from 'lib/services/saksbehandlingservice/saksbehandlingService';
import { logError } from 'lib/serverutlis/logger';
import { isError } from 'lib/utils/api';

export async function POST(req: NextRequest, props: { params: Promise<{ saksnummer: string }> }) {
  const params = await props.params;
  const res = await opprettAktivitetspliktBehandling(params.saksnummer);
  if (isError(res)) {
    logError(
      `/sak/${params.saksnummer}/opprettAktivitetspliktBehandling ${res.status} - ${res.apiException.code}: ${res.apiException.message}`
    );
  }
  return new Response(JSON.stringify(res), { status: res.status });
}
