import { logError } from '@navikt/aap-felles-utils';
import { hentAlleDialogmeldingerPåSak } from 'lib/services/saksbehandlingservice/saksbehandlingService';
import { NextRequest } from 'next/server';

/*
const testdata: LegeerklæringStatus[] = [
  {
    behandlerRef: '1234',
    dialogmeldingUuid: 'uuid-1',
    opprettet: '2024-08-12',
    personId: '12345678910',
    saksnummer: 'string',
    status: 'SENDT',
    behandlerNavn: 'Trude Lutt',
    fritekst: 'Fritekst til behandler',
  },
  {
    behandlerRef: '1234',
    dialogmeldingUuid: 'uuid-3',
    opprettet: '2024-10-27',
    personId: '12345678910',
    saksnummer: 'string',
    status: 'OK',
    behandlerNavn: 'Iren Panikk',
    fritekst: 'Fritekst til behandler',
  },
];
*/

export async function GET(_: NextRequest, props: { params: Promise<{ saksnummer: string }> }) {
  const params = await props.params;
  try {
    const data = await hentAlleDialogmeldingerPåSak(params.saksnummer);
    return new Response(JSON.stringify(data), { status: 200 });
    //return new Response(JSON.stringify(testdata), { status: 200 });
  } catch (err) {
    logError(`/dokumentinnhenting/behandleroppslag`, err);
    return new Response(JSON.stringify({ message: 'Behandleroppslag feilet' }), { status: 500 });
  }
}
