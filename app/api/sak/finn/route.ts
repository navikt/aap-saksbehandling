import { FinnSakForIdent } from 'lib/types/types';
import { NextResponse } from 'next/server';
import { finnSakerForIdent } from 'lib/services/saksbehandlingservice/saksbehandlingService';
import { logError } from '@navikt/aap-felles-utils';

const allowedOrigins = [
  'http://localhost:3000',
  'https://aap-saksbehandling.ansatt.dev.nav.no',
  'https://aap-oppgavestyring.ansatt.dev.nav.no',
  'https://www.nav.no'];

export async function POST(req: Request) {
  const body: FinnSakForIdent = await req.json();

  let data = [];
  try {
    data = await finnSakerForIdent(body.ident);
  } catch (err) {
    logError('/api/sak/finn', err);
    return new Response(JSON.stringify({ message: 'Noe gikk galt' }), { status: 500 });
  }

  const origin = req.headers.get('Origin') ?? '';
  return NextResponse.json(data, {
    headers: {
      'Access-Control-Allow-Methods': `POST`,
      'Access-Control-Allow-Headers':
        '*',
      'Access-Control-Allow-Origin': allowedOrigins.includes(origin) ? origin : '',
      'Access-Control-Allow-Credentials': 'true',
    },
    status: 200,
  });
}
