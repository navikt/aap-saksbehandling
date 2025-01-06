import { NextRequest } from 'next/server';
import { oppdaterBruddPåAktivitetsplikten } from '../../../../../../lib/services/saksbehandlingservice/saksbehandlingService';
import { logError } from '@navikt/aap-felles-utils';

export async function POST(req: NextRequest, { params }: { params: { saksnummer: string } }) {
  const body = await req.json();
  try {
    await oppdaterBruddPåAktivitetsplikten(params.saksnummer, body);
  } catch (err) {
    logError(`/sak/${params.saksnummer}/aktivitetsplikt/oppdater`, err);
    return new Response(JSON.stringify({ message: 'Oppdatering av brudd på aktivitetsplikt feilet' }), { status: 500 });
  }
  return new Response(JSON.stringify({}), { status: 200 });
}
