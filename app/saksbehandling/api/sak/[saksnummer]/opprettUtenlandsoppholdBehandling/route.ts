import { logError } from 'lib/serverutlis/logger';
import { opprettUtenlandsoppholdBehandling } from 'lib/services/saksbehandlingservice/saksbehandlingService';
import { isServerError } from 'lib/utils/api';
import { NextRequest, NextResponse } from 'next/server';

export async function POST(req: NextRequest, props: { params: Promise<{ saksnummer: string }> }) {
  const params = await props.params;
  const res = await opprettUtenlandsoppholdBehandling(params.saksnummer, await req.json());
  if (isServerError(res)) {
    logError(
      `/sak/${params.saksnummer}/opprettUtenlandsoppholdBehandling ${res.status} - ${res.apiException.code}: ${res.apiException.message}`
    );
  }
  return NextResponse.json(res, { status: res.status });
}
