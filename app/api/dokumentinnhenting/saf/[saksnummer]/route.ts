import { isLocal, logError } from '@navikt/aap-felles-utils';
import { RelevantDokumentType } from 'components/innhentdokumentasjon/relevantedokumenter/RelevanteDokumenter';
import { hentRelevanteDokumenter } from 'lib/services/dokumentinnhentingservice/dokumentinnhentingservice';

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
    return new Response(JSON.stringify(mockData), { status: 200 });
  }
  try {
    const res = await hentRelevanteDokumenter(saksnummer);
    return new Response(JSON.stringify(res), { status: 200 });
  } catch (error) {
    logError('Feil ved henting av relevante dokumenter', error);
    return new Response(JSON.stringify({ message: JSON.stringify(error) }), { status: 500 });
  }
}
