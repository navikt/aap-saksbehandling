import { logError } from '@navikt/aap-felles-utils';
import { hentAlleDialogmeldingerPåSak } from 'lib/services/saksbehandlingservice/saksbehandlingService';
import { NextRequest } from 'next/server';

export async function GET(_: NextRequest, { params }: { params: { saksnummer: string } }) {
  try {
    const data = await hentAlleDialogmeldingerPåSak(params.saksnummer);
    return new Response(JSON.stringify(data), { status: 200 });
  } catch (err) {
    logError(`/dokumentinnhenting/behandleroppslag`, err);
    return new Response(JSON.stringify({ message: 'Behandleroppslag feilet' }), { status: 500 });
  }
}
