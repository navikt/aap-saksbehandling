import { NextRequest } from 'next/server';
import { lagreBruddPåAktivitetsplikten } from 'lib/services/saksbehandlingservice/saksbehandlingService';
import { logError } from '@navikt/aap-felles-utils';

export async function POST(req: NextRequest) {
  const body = await req.json();
  try {
    await lagreBruddPåAktivitetsplikten(body);
  } catch (err) {
    logError('/aktivitetsplikt/lagre', err);
    return new Response(JSON.stringify({ message: 'Innsending av brudd på aktivitetsplikt feilet' }), { status: 500 });
  }
  return new Response(JSON.stringify({}), { status: 200 });
}
