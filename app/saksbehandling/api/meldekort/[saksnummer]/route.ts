import { logError } from 'lib/serverutlis/logger';
import { isError } from 'lib/utils/api';
import { NextRequest, NextResponse } from 'next/server';
import { hentMeldekort, oppdaterMeldekort } from 'lib/services/saksbehandlingservice/saksbehandlingService';
import { OppdaterMeldekortRequest } from 'lib/types/types';

export async function GET(_: NextRequest, props: { params: Promise<{ saksnummer: string }> }) {
  const params = await props.params;
  const res = await hentMeldekort(params.saksnummer);
  if (isError(res)) {
    logError(`/api/meldekort/${params.saksnummer} - ${res.apiException.code}: ${res.apiException.message}`);
  }

  return NextResponse.json(res, { status: res.status });
}

export async function POST(request: NextRequest, props: { params: Promise<{ saksnummer: string }> }) {
  const params = await props.params;
  const payload: OppdaterMeldekortRequest = await request.json();

  const res = await oppdaterMeldekort(params.saksnummer, payload);

  return NextResponse.json(res, { status: res.status });
}
