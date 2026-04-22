import 'server-only';

import { apiFetch } from 'lib/services/apiFetch';
import { FetchResponse } from 'lib/utils/api';

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

export const hentArenaSakerForPerson = async (
  personidentifikator: string
): Promise<FetchResponse<SakerResponse>> => {
  const url = `${apiInternBaseUrl}/arena/person/saker`;
  const body: ArenaoppslagSakerRequestV1 = { personidentifikator };
  return await apiFetch<SakerResponse>(url, apiInternScope, 'POST', body);
};
