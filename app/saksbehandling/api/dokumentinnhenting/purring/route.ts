import { logError } from '@navikt/aap-felles-utils';
import { purrPåLegeerklæring } from 'lib/services/saksbehandlingservice/saksbehandlingService';
import { isLocal } from 'lib/utils/environment';
import { NextRequest } from 'next/server';

export async function POST(req: NextRequest) {
  if (isLocal()) {
    return new Response(JSON.stringify({ message: 'ok' }), { status: 200 });
  }
  try {
    const body = await req.json();
    const res = purrPåLegeerklæring(body);
    return new Response(JSON.stringify(res), { status: 200 });
  } catch (error) {
    logError('Feil ved purring på legeklæring', error);
    return new Response(JSON.stringify({ message: JSON.stringify(error) }), { status: 500 });
  }
}
