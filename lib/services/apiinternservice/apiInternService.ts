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
      lopenummer: 1,
      aar: 2024,
      antallVedtak: 2,
      sakstype: 'AAP',
      regDato: '2024-01-15',
      avsluttetDato: null,
    },
    {
      sakId: '044246',
      lopenummer: 2,
      aar: 2023,
      antallVedtak: 4,
      sakstype: 'Yrkesrettet attføring',
      regDato: '2023-03-20',
      avsluttetDato: '2024-01-01',
    },
    {
      sakId: '044247',
      lopenummer: 3,
      aar: 2023,
      antallVedtak: 1,
      sakstype: 'Klage/Anke',
      regDato: '2023-09-05',
      avsluttetDato: '2023-12-15',
    },
    {
      sakId: '044248',
      lopenummer: 4,
      aar: 2022,
      antallVedtak: 3,
      sakstype: 'Feilutbetaling',
      regDato: '2022-06-10',
      avsluttetDato: '2023-02-28',
    },
    {
      sakId: '044249',
      lopenummer: 5,
      aar: 2021,
      antallVedtak: 6,
      sakstype: 'Yrkesrettet attføring',
      regDato: '2021-11-01',
      avsluttetDato: '2022-05-31',
    },
    {
      sakId: '044250',
      lopenummer: 6,
      aar: 2025,
      antallVedtak: 1,
      sakstype: 'AAP',
      regDato: '2025-02-14',
      avsluttetDato: null,
    },
  ],
};

export const hentArenaSakerForPerson = async (
  personidentifikator: string
): Promise<FetchResponse<SakerResponse>> => {
  if (isLocal()) {
    return { type: 'SUCCESS', status: 200, data: dummySakerResponse };
  }

  const url = `${apiInternBaseUrl}/arena/person/saker`;
  const body: ArenaoppslagSakerRequestV1 = { personidentifikator };
  return await apiFetch<SakerResponse>(url, apiInternScope, 'POST', body);
};
