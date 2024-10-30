import { NextRequest } from 'next/server';
import { opprettBruddPåAktivitetsplikten } from 'lib/services/saksbehandlingservice/saksbehandlingService';
import { logError } from '@navikt/aap-felles-utils';

export async function POST(req: NextRequest, { params }: { params: { saksnummer: string } }) {
  const body = await req.json();
  try {
    await opprettBruddPåAktivitetsplikten(params.saksnummer, body);
  } catch (err) {
    logError(`/aktivitetsplikt/${params.saksnummer}/lagre`, err);
    return new Response(JSON.stringify({ message: 'Innsending av brudd på aktivitetsplikt feilet' }), { status: 500 });
  }
  return new Response(JSON.stringify({}), { status: 200 });
}
