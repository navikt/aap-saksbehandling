import { DetaljertBehandling, LøsAvklaringsbehovPåBehandling, SaksInfo, UtvidetSaksInfo } from 'lib/types/types';

import { fetchProxy } from './fetchProxy';

const saksbehandlingApiBaseUrl = process.env.BEHANDLING_API_BASE_URL;
const saksbehandlingScope = process.env.BEHANDLING_API_SCOPE ?? '';

export const hentBehandling = async (
  behandlingsReferanse: string,
  accessToken: string
): Promise<DetaljertBehandling | undefined> => {
  const url = `${saksbehandlingApiBaseUrl}/api/behandling/hent/${behandlingsReferanse}`;
  return await fetchProxy<DetaljertBehandling>(url, accessToken, saksbehandlingScope);
};

export const hentSak = async (saksnummer: string, accessToken: string): Promise<UtvidetSaksInfo | undefined> => {
  const url = `${saksbehandlingApiBaseUrl}/api/sak/hent/${saksnummer}`;
  return await fetchProxy<UtvidetSaksInfo>(url, accessToken, saksbehandlingScope);
};

export const hentAlleSaker = async (accessToken: string): Promise<SaksInfo[]> => {
  const url = `${saksbehandlingApiBaseUrl}/api/sak/alle`;
  return await fetchProxy<SaksInfo[]>(url, accessToken, saksbehandlingScope);
};

export const løsAvklaringsbehov = async (avklaringsBehov: LøsAvklaringsbehovPåBehandling, accessToken: string) => {
  const url = `${saksbehandlingApiBaseUrl}/api/behandling/løs-behov`;
  return await fetchProxy<void>(url, accessToken, saksbehandlingScope, 'POST', avklaringsBehov);
};
