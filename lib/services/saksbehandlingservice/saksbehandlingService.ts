import {
  DetaljertBehandling,
  LøsAvklaringsbehovPåBehandling,
  OpprettTestcase,
  SaksInfo,
  UtvidetSaksInfo,
} from '../../types/types';

import { fetchProxy } from '../fetchProxy';

const saksbehandlingApiBaseUrl = process.env.BEHANDLING_API_BASE_URL;
const saksbehandlingScope = process.env.BEHANDLING_API_SCOPE ?? '';

export const hentBehandling = async (
  behandlingsReferanse: string,
  accessToken: string
): Promise<DetaljertBehandling | undefined> => {
  const url = `${saksbehandlingApiBaseUrl}/api/behandling/${behandlingsReferanse}`;
  return await fetchProxy<DetaljertBehandling>(url, accessToken, saksbehandlingScope, 'GET', undefined, true);
};

export const hentSak = async (saksnummer: string, accessToken: string): Promise<UtvidetSaksInfo> => {
  const url = `${saksbehandlingApiBaseUrl}/api/sak/${saksnummer}`;
  const response = await fetchProxy<UtvidetSaksInfo>(url, accessToken, saksbehandlingScope, 'GET', undefined, true);
  if (response) {
    return response;
  }

  throw new Error('Fant ingen sak.');
};

export const hentAlleSaker = async (accessToken: string): Promise<SaksInfo[] | undefined> => {
  const url = `${saksbehandlingApiBaseUrl}/api/sak/alle`;
  return await fetchProxy<SaksInfo[]>(url, accessToken, saksbehandlingScope, 'GET', undefined, true);
};

export const løsAvklaringsbehov = async (avklaringsBehov: LøsAvklaringsbehovPåBehandling, accessToken: string) => {
  const url = `${saksbehandlingApiBaseUrl}/api/behandling/løs-behov`;
  return await fetchProxy<void>(url, accessToken, saksbehandlingScope, 'POST', avklaringsBehov);
};

export const opprettTestSak = async (sak: OpprettTestcase, accessToken: string) => {
  const url = `${saksbehandlingApiBaseUrl}/test/opprett`;
  return await fetchProxy<void>(url, accessToken, saksbehandlingScope, 'POST', sak);
};
