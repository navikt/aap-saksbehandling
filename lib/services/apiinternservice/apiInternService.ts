import 'server-only';

import { apiFetch } from 'lib/services/apiFetch';
import { FetchResponse } from 'lib/utils/api';
import { isLocal } from 'lib/utils/environment';
import {
  ArenaoppslagSakerRequestV1,
  ArenaSakMedVedtakResponse,
  ManuellFordelingsgrunnlagRequest,
  ManuellFordelingsgrunnlagResponse,
  SakerResponse,
} from './apiInternServiceDTOs';
import {
  dummyManuellFordelingsgrunnlagResponse,
  dummySakerResponse,
  getDummyArenaSakMedVedtakResponse,
} from './apiInternServiceMock';

const apiInternBaseUrl = process.env.API_INTERN_BASE_URL;
const apiInternScope = process.env.API_INTERN_SCOPE ?? '';

export const hentArenaSakerForPerson = async (personidentifikator: string): Promise<FetchResponse<SakerResponse>> => {
  if (isLocal()) {
    return { type: 'SUCCESS', status: 200, data: dummySakerResponse };
  }

  const url = `${apiInternBaseUrl}/arena/person/saker`;
  const body: ArenaoppslagSakerRequestV1 = { personidentifikator };
  return await apiFetch<SakerResponse>(url, apiInternScope, 'POST', body);
};

export const hentManuellFordelingsgrunnlag = async (
  personidentifikator: string
): Promise<FetchResponse<ManuellFordelingsgrunnlagResponse>> => {
  if (isLocal()) {
    return { type: 'SUCCESS', status: 200, data: dummyManuellFordelingsgrunnlagResponse };
  }

  const url = `${apiInternBaseUrl}/arena/person/manuell-fordelingsgrunnlag`;
  const body: ManuellFordelingsgrunnlagRequest = { personidentifikator };
  return await apiFetch<ManuellFordelingsgrunnlagResponse>(url, apiInternScope, 'POST', body);
};

export const hentArenaSakMedVedtak = async (sakId: string): Promise<FetchResponse<ArenaSakMedVedtakResponse>> => {
  if (isLocal()) {
    return getDummyArenaSakMedVedtakResponse(sakId);
  }

  const url = `${apiInternBaseUrl}/arena/sak/${sakId}`;
  return await apiFetch<ArenaSakMedVedtakResponse>(url, apiInternScope, 'GET');
};
