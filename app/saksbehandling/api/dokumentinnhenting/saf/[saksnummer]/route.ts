import { logError } from 'lib/serverutlis/logger';
import { RelevantDokumentType } from 'components/innhentdokumentasjon/relevantedokumenter/RelevanteDokumenter';
import { hentRelevanteDokumenter } from 'lib/services/dokumentinnhentingservice/dokumentinnhentingservice';
import { isLocal } from 'lib/utils/environment';
import { FetchResponse, isError } from 'lib/utils/api';

const mockData: RelevantDokumentType[] = [
  {
    tema: 'AAP',
    dokumentInfoId: 'diid-1',
    journalpostId: 'jpid-1',
    tittel: 'Sykemelding 39u',
    erUtgående: false,
    datoOpprettet: '2024-12-20',
    variantformat: 'ORIGINAL',
  },
  {
    tema: 'AAP',
    dokumentInfoId: 'diid-2',
    journalpostId: 'jpid-2',
    tittel: 'L40 - legeerklæring',
    erUtgående: false,
    datoOpprettet: '2024-12-27',
    variantformat: 'ORIGINAL',
  },
];

export async function POST(_: Request, { params }: { params: Promise<{ saksnummer: string }> }) {
  const saksnummer = (await params).saksnummer;
  if (isLocal()) {
    const response: FetchResponse<RelevantDokumentType[]> = {
      type: 'SUCCESS',
      status: 200,
      data: mockData,
    };
    return new Response(JSON.stringify(response), { status: 200 });
  }

  const res = await hentRelevanteDokumenter(saksnummer);

  if (isError(res)) {
    logError('Feil ved henting av relevante dokumenter', res.apiException.message);
  }

  return new Response(JSON.stringify(res), { status: 200 });
}
