import 'server-only';

import { apiFetch } from 'lib/services/apiFetch';
import { FetchResponse } from 'lib/utils/api';
import { isLocal } from 'lib/utils/environment';

const apiInternBaseUrl = process.env.API_INTERN_BASE_URL;
const apiInternScope = process.env.API_INTERN_SCOPE ?? '';

export type ArenaoppslagSakerRequestV1 = {
  personidentifikator: string;
};

export type ArenaSakOppsummeringKontrakt = {
  sakId: string;
  lopenummer: number;
  aar: number;
  antallVedtak: number;
  statuskode: string;
  statusnavn: string;
  sakstype: string;
  regDato: string;
  avsluttetDato: string | null;
};

export type SakerResponse = {
  saker: ArenaSakOppsummeringKontrakt[];
};

const dummySakerResponse: SakerResponse = {
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

export const hentArenaSakerForPerson = async (personidentifikator: string): Promise<FetchResponse<SakerResponse>> => {
  if (isLocal()) {
    return { type: 'SUCCESS', status: 200, data: dummySakerResponse };
  }

  const url = `${apiInternBaseUrl}/arena/person/saker`;
  const body: ArenaoppslagSakerRequestV1 = { personidentifikator };
  return await apiFetch<SakerResponse>(url, apiInternScope, 'POST', body);
};
