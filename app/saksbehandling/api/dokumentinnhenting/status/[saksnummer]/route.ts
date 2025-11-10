import { logError } from 'lib/serverutlis/logger';
import { hentAlleDialogmeldingerPåSak } from 'lib/services/saksbehandlingservice/saksbehandlingService';
import { LegeerklæringStatus } from 'lib/types/types';
import { isLocal } from 'lib/utils/environment';
import { NextRequest, NextResponse } from 'next/server';
import { FetchResponse, isError } from 'lib/utils/api';

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

const lokalFakeStatusPåDokumentbestilling = isLocal();
export async function GET(_: NextRequest, props: { params: Promise<{ saksnummer: string }> }) {
  const params = await props.params;
  if (lokalFakeStatusPåDokumentbestilling) {
    const response: FetchResponse<LegeerklæringStatus[]> = {
      type: 'SUCCESS',
      status: 200,
      data: testdata,
    };
    return NextResponse.json(response, { status: 200 });
  }

  const data = await hentAlleDialogmeldingerPåSak(params.saksnummer);

  if (isError(data)) {
    logError(`/dokumentinnhenting/behandleroppslag`, data.apiException.message);
  }

  return NextResponse.json(data, { status: 200 });
}
