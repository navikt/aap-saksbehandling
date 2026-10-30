import { logError } from 'lib/serverutlis/logger';
import { opprettAktivitetspliktBehandling } from 'lib/services/saksbehandlingservice/saksbehandlingService';
import { isServerError } from 'lib/utils/api';
import { NextRequest, NextResponse } from 'next/server';
import { readRequestBody } from 'lib/serverutlis/readRequestBody';
import { OpprettAktivitetspliktBehandlingDto } from 'lib/types/types';

export async function POST(req: NextRequest, props: { params: Promise<{ saksnummer: string }> }) {
  const params = await props.params;
  const res = await opprettAktivitetspliktBehandling(
    params.saksnummer,
    await readRequestBody<OpprettAktivitetspliktBehandlingDto>(req)
  );
  if (isServerError(res)) {
    logError(
      `/sak/${params.saksnummer}/opprettAktivitetspliktBehandling ${res.status} - ${res.apiException.code}: ${res.apiException.message}`
    );
  }
  return NextResponse.json(res, { status: res.status });
}
