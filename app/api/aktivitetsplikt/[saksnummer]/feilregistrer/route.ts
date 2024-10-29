import { NextRequest } from 'next/server';
import { logError } from '@navikt/aap-felles-utils';
import { feilregistrerBruddPåAktivitetsplikten } from 'lib/services/saksbehandlingservice/saksbehandlingService';

export async function POST(req: NextRequest, { params }: { params: { saksnummer: string } }) {
  const body = await req.json();
  try {
    await feilregistrerBruddPåAktivitetsplikten(params.saksnummer, body);
  } catch (err) {
    logError(`/aktivitetsplikt/${params.saksnummer}/feilregistrer`, err);
    return new Response(JSON.stringify({ message: 'Feilregistrering av brudd på aktivitetsplikt feilet' }), {
      status: 500,
    });
  }
  return new Response(JSON.stringify({}), { status: 200 });
}
