import { logError } from 'lib/serverutlis/logger';
import { opprettAktivitetspliktBehandling } from 'lib/services/saksbehandlingservice/saksbehandlingService';
import { isError } from 'lib/utils/api';
import { NextRequest, NextResponse } from 'next/server';

export async function POST(req: NextRequest, props: { params: Promise<{ saksnummer: string }> }) {
  const params = await props.params;
  const res = await opprettAktivitetspliktBehandling(params.saksnummer, await req.json());
  if (isError(res) && res.status >= 500) {
    logError(
      `/sak/${params.saksnummer}/opprettAktivitetspliktBehandling ${res.status} - ${res.apiException.code}: ${res.apiException.message}`
    );
  }
  return NextResponse.json(res, { status: res.status });
}
