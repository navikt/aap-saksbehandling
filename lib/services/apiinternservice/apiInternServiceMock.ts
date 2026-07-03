import { FetchResponse } from 'lib/utils/api';
import { ArenaSakMedVedtakResponse, SakerResponse } from './apiInternServiceDTOs';

export const dummySakerResponse: SakerResponse = {
  saker: [
    {
      sakId: '044245',
      lopenummer: 100241,
      aar: 2024,
      antallVedtak: 2,
      sakstype: 'AAP',
      regDato: '2024-01-15',
      avsluttetDato: null,
      statuskode: 'AKTIV',
      statusnavn: 'Aktiv',
    },
    {
      sakId: '044246',
      lopenummer: 100242,
      aar: 2023,
      antallVedtak: 4,
      sakstype: 'Yrkesrettet attføring',
      regDato: '2023-03-20',
      avsluttetDato: '2024-01-01',
      statuskode: 'INAKT',
      statusnavn: 'Inaktiv',
    },
    {
      sakId: '044247',
      lopenummer: 100243,
      aar: 2023,
      antallVedtak: 1,
      sakstype: 'Klage/Anke',
      regDato: '2023-09-05',
      avsluttetDato: '2023-12-15',
      statuskode: 'INAKT',
      statusnavn: 'Inaktiv',
    },
  ],
};

const SAK_ID_PATTERN = /^(\d{4})-(\d{3,})$/;

export const getDummyArenaSakMedVedtakResponse = (sakId: string): FetchResponse<ArenaSakMedVedtakResponse> => {
  const match = SAK_ID_PATTERN.exec(sakId);
  if (!match) {
    return { type: 'ERROR', status: 404, apiException: { message: 'Not Found' } };
  }

  const opprettetAar = parseInt(match[1], 10);
  const lopenr = parseInt(match[2], 10);
  const erOddetall = lopenr % 2 !== 0;
  const statuskode = erOddetall ? 'AVSLU' : 'AKTIV';
  const statusnavn = erOddetall ? 'Lukket' : 'Aktiv';

  return {
    type: 'SUCCESS',
    status: 200,
    data: {
      sakId,
      opprettetAar,
      lopenr,
      person: {
        personId: 123456,
        fodselsnummer: '01410047132',
        fornavn: 'Ola',
        etternavn: 'Nordmann',
      },
      statuskode,
      statusnavn,
      registrertDato: '2024-01-15T08:00:00',
      avsluttetDato: null,
      vedtak: [
        {
          vedtakId: 1001,
          lopenrvedtak: 1,
          statusKode: 'IVERK',
          statusNavn: 'Iverksatt',
          vedtaktypeKode: 'O',
          vedtaktypeNavn: 'Ny rettighet',
          aktivitetsfaseKode: 'UA',
          aktivitetsfaseNavn: 'Under arbeidsavklaring',
          fraOgMed: '2024-01-15',
          tilDato: '2024-12-31',
          rettighetkode: 'AAP',
          rettighetnavn: 'Arbeidsavklaringspenger',
          utfallkode: 'JA',
          begrunnelse: 'Innvilget AAP',
          saksbehandler: 'Z123456',
          beslutter: 'Z654321',
          relatertVedtak: null,
          fakta: [
            {
              kode: 'TBdebut',
              navn: 'Dato for tidligste behandlingsdebut',
              verdi: '2024-01-01',
              registrertDato: '2024-01-15',
            },
            {
              kode: 'DAGSSATS',
              navn: 'Dagssats',
              verdi: '1060',
              registrertDato: '2024-01-15',
            },
          ],
        },
      ],
    },
  };
};
