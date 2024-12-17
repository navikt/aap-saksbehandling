import { logError } from '@navikt/aap-felles-utils';
import { hentAlleDialogmeldingerPåSak } from 'lib/services/saksbehandlingservice/saksbehandlingService';
import { LegeerklæringStatus } from 'lib/types/types';
import { isLocal } from 'lib/utils/environment';
import { NextRequest } from 'next/server';

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

export async function GET(_: NextRequest, { params }: { params: { saksnummer: string } }) {
  if (isLocal()) {
    return new Response(JSON.stringify(testdata), { status: 200 });
  }

  try {
    const data = await hentAlleDialogmeldingerPåSak(params.saksnummer);
    return new Response(JSON.stringify(data), { status: 200 });
  } catch (err) {
    logError(`/dokumentinnhenting/behandleroppslag`, err);
    return new Response(JSON.stringify({ message: 'Behandleroppslag feilet' }), { status: 500 });
  }
}
