import { logError } from 'lib/serverutlis/logger';
import { registrerMeldedato } from 'lib/services/saksbehandlingservice/saksbehandlingService';
import { RegistrerMeldedatoRequest } from 'lib/types/types';
import { isServerError } from 'lib/utils/api';
import { NextRequest, NextResponse } from 'next/server';

export async function POST(request: NextRequest, props: { params: Promise<{ saksnummer: string }> }) {
  const params = await props.params;
  const payload: RegistrerMeldedatoRequest = await request.json();

  const res = await registrerMeldedato(params.saksnummer, payload);

  if (isServerError(res)) {
    logError(`/api/meldekort/${params.saksnummer}/registrer-meldedato - ${res.apiException.code}: ${res.apiException.message}`);
  }

  return NextResponse.json(res, { status: res.status });
}
