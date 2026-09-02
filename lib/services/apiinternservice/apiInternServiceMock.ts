import { FetchResponse } from 'lib/utils/api';
import { ArenaSakMedVedtakResponse, ManuellFordelingsgrunnlagResponse, SakerResponse } from './apiInternServiceDTOs';

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

export const dummyManuellFordelingsgrunnlagResponse: ManuellFordelingsgrunnlagResponse = {
  saksnummer: '2024-100241',
  erAktiv: true,
  under52Uker: true,
  gjenståendeOrdinæreDager: 120,
  gjenståendeUnntaksDager: 0,
  sisteVedtak: {
    vedtakId: 1001,
    aktfaseKode: 'UA',
    vedtaktypeKode: 'O',
    fra: '2024-01-15',
    til: '2024-12-31',
    maxdatoOrdinaer: '2025-01-15',
    maxdatoUnntak: null,
    maxdatoAap: '2025-01-15',
  },
  sisteUtbetaling: '2024-11-15',
  oppgaver: [
    {
      oppgaveId: 5001,
      beskrivelse: 'Vurder aktivitetsplikt',
      sakskontekst: 'AAP 2024-100241',
      visningsnavn: 'Ola Nordmann',
      fristDato: '2024-12-01',
      arbeidsbenk: 'AAP',
      oppgaveEnhet: '0415',
      navEnhet: '0415',
      notat: 'Bruker har levert nye opplysninger',
    },
    {
      oppgaveId: 5002,
      beskrivelse: 'Behandle meldekort',
      sakskontekst: 'AAP 2024-100241',
      visningsnavn: 'Ola Nordmann',
      fristDato: null,
      arbeidsbenk: 'AAP',
      oppgaveEnhet: '0415',
      navEnhet: null,
      notat: null,
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
