import { NextRequest } from 'next/server';
import { sendAktivitetsMelding } from 'lib/services/saksbehandlingservice/saksbehandlingService';
import { logError } from '@navikt/aap-felles-utils';

export async function POST(req: NextRequest) {
  const body = await req.json();
  try {
    await sendAktivitetsMelding(body);
  } catch (err) {
    logError('/hammer/send', err);
    return new Response(JSON.stringify({ message: 'Innsending av aktivitet feilet' }), { status: 500 });
  }
  return new Response(JSON.stringify({}), { status: 200 });
}
