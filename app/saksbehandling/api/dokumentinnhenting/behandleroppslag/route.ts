import { Behandler } from 'components/innhentdokumentasjon/innhentdokumentasjonskjema/InnhentDokumentasjonSkjema';
import { hentBehandleroppslag } from 'lib/services/dokumentinnhentingservice/dokumentinnhentingservice';
import { isLocal } from 'lib/utils/environment';
import { NextRequest } from 'next/server';
import { logError } from 'lib/serverutlis/logger';
import { FetchResponse, isError } from 'lib/utils/api';

const testdata: Behandler[] = [
  {
    behandlerRef: '26a75260-1366-4517-b348-5f57c840ba76',
    fnr: '18075000630',
    fornavn: 'Ea',
    etternavn: 'Pettersen',
    orgnummer: '971467584',
    kontor: 'SAUPSTAD LEGESENTER',
    adresse: '9654',
    postnummer: '7478',
    poststed: 'Trondheim',
    telefon: '72594500',
    hprId: 'hpr-2348',
  },
  {
    behandlerRef: '26a75263-1362-4520-f348-5f57c840bc91',
    fnr: '09078400201',
    fornavn: 'Viggo',
    etternavn: 'Røskeland',
    orgnummer: '971467584',
    kontor: 'TANA LEGESENTER',
    adresse: '9654',
    postnummer: '7478',
    poststed: 'Trondheim',
    telefon: '72594500',
    hprId: 'hpr-cf17',
  },
  {
    behandlerRef: 'unik-id-for-behandler',
    fnr: '1234567902',
    fornavn: 'Trond',
    mellomnavn: 'Egil',
    etternavn: 'Johnsen',
    orgnummer: '971467584',
    kontor: 'TANA TANNLEGE',
    adresse: '9654',
    postnummer: '7478',
    poststed: 'Trondheim',
    telefon: '72594500',
    hprId: 'hpr-a80e',
  },
];

export async function POST(req: NextRequest) {
  if (isLocal()) {
    const response: FetchResponse<Behandler[]> = {
      type: 'SUCCESS',
      data: testdata,
      status: 200,
    };

    return new Response(JSON.stringify(response), { status: 200 });
  }
  const body = await req.json();
  const res = await hentBehandleroppslag(body);
  if (isError(res)) {
    logError(`/dokumentinnhenting/behandleroppslag`, res.apiException.message);
  }

  return new Response(JSON.stringify(res), { status: 200 });
}
