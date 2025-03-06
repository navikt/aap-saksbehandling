import { NextRequest } from 'next/server';
import { logError } from '@navikt/aap-felles-utils';
import { opprettBruddPåAktivitetsplikten } from 'lib/services/saksbehandlingservice/saksbehandlingService';

export async function POST(req: NextRequest, props: { params: Promise<{ saksnummer: string }> }) {
  const params = await props.params;
  const body = await req.json();
  try {
    await opprettBruddPåAktivitetsplikten(params.saksnummer, body);
  } catch (err) {
    logError(`/sak/${params.saksnummer}/aktivitetsplikt/lagre`, err);
    return new Response(JSON.stringify({ message: 'Innsending av brudd på aktivitetsplikt feilet' }), { status: 500 });
  }
  return new Response(JSON.stringify({}), { status: 200 });
}
