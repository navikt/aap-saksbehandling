import { logError } from '@navikt/aap-felles-utils';
import { leggTilIBehandlingsflytYrkesskadeMock } from 'lib/services/saksbehandlingservice/saksbehandlingService';
import { NextRequest } from 'next/server';

export async function POST(req: NextRequest) {
  const body = await req.json();
  try {
    await leggTilIBehandlingsflytYrkesskadeMock(body);
  } catch (err: unknown) {
    logError('/test/yrkesskademock/', err);
    return new Response(JSON.stringify({ message: err?.toString() }), { status: 500 });
  }
  return new Response(JSON.stringify({ message: 'Yrkesskade lagt til i mock-register' }), { status: 200 });
}
