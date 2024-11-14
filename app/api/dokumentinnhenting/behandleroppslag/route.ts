import { logError } from '@navikt/aap-felles-utils';
import { Behandler } from 'components/innhentdokumentasjon/innhentdokumentasjonskjema/InnhentDokumentasjonSkjema';
import { fetchProxy } from 'lib/services/fetchProxy';
import { NextRequest } from 'next/server';

const dokumentinnhentingApiBaseUrl = 'http://dokumentinnhenting';
const dokumentinnhentingApiScope = 'api://dev-gcp.aap.dokumentinnhenting/.default';
/*
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
  },
];
*/
export async function POST(req: NextRequest) {
  const body = await req.json();
  try {
    const url = `${dokumentinnhentingApiBaseUrl}/syfo/behandleroppslag/search`;
    const res = await fetchProxy<Behandler[]>(url, dokumentinnhentingApiScope, 'POST', body);
    return new Response(JSON.stringify(res), { status: 200 });
  } catch (err) {
    logError(`/dokumentinnhenting/behandleroppslag`, err);
    return new Response(JSON.stringify({ message: 'Behandleroppslag feilet' }), { status: 500 });
  }
}
