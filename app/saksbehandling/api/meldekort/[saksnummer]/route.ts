import { logError } from 'lib/serverutlis/logger';
import { hentMeldekort, oppdaterMeldekort } from 'lib/services/saksbehandlingservice/saksbehandlingService';
import { OppdaterMeldekortRequest } from 'lib/types/types';
import { isServerError } from 'lib/utils/api';
import { NextRequest, NextResponse } from 'next/server';
import { readRequestBody } from 'lib/serverutlis/readRequestBody';

export async function GET(_: NextRequest, props: { params: Promise<{ saksnummer: string }> }) {
  const params = await props.params;
  const res = await hentMeldekort(params.saksnummer);
  if (isServerError(res)) {
    logError(`/api/meldekort/${params.saksnummer} - ${res.apiException.code}: ${res.apiException.message}`);
  }

  return NextResponse.json(res, { status: res.status });
}

export async function POST(request: NextRequest, props: { params: Promise<{ saksnummer: string }> }) {
  const params = await props.params;
  const payload = await readRequestBody<OppdaterMeldekortRequest>(request);

  const res = await oppdaterMeldekort(params.saksnummer, payload);

  return NextResponse.json(res, { status: res.status });
}
