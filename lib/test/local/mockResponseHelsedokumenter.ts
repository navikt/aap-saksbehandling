import { FetchResponse } from 'lib/utils/api';
import { RelevantDokumentType } from 'components/innhentdokumentasjon/relevantedokumenter/RelevanteDokumenter';

export const mockResponseHelsedokumenter: FetchResponse<RelevantDokumentType[]> = {
  type: 'SUCCESS',
  status: 200,
  data: [
    {
      tema: 'SYK',
      journalpostId: '453924127',
      dokumentInfoId: '454326000',
      tittel: 'Legeerklæring 29.12.2017',
      brevkode: 'NAV 08-07.08',
      variantformat: 'ARKIV',
      erUtgående: true,
      datoOpprettet: '2025-01-16T15:35:54',
    },
    {
      tema: 'AAP',
      journalpostId: '453924127',
      dokumentInfoId: '454326001',
      tittel: 'Vedlegg til legeerklæring 29.12.2017',
      brevkode: undefined,
      variantformat: 'ARKIV',
      erUtgående: true,
      datoOpprettet: '2025-01-16T15:35:54',
    },
    {
      tema: 'AAP',
      journalpostId: '453924126',
      dokumentInfoId: '454325999',
      tittel: 'Forespørsel om legeerklæring og arbeidsuførhet',
      brevkode: 'L40',
      variantformat: 'ARKIV',
      erUtgående: true,
      datoOpprettet: '2025-01-16T15:35:54',
    },
  ],
};
