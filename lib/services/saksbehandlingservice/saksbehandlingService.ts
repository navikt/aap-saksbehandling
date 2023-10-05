import { notFound } from 'next/navigation';
import {
  BehandlingFlytOgTilstand,
  BehandlingFlytOgTilstand2,
  DetaljertBehandling,
  LøsAvklaringsbehovPåBehandling,
  OpprettTestcase,
  SaksInfo,
  SykdomsGrunnlag,
  UtvidetSaksInfo,
  YrkesskadeGrunnlag,
} from 'lib/types/types';

import { fetchProxy } from '../fetchProxy';

const saksbehandlingApiBaseUrl = process.env.BEHANDLING_API_BASE_URL;
const saksbehandlingScope = process.env.BEHANDLING_API_SCOPE ?? '';

export const hentBehandling = async (
  behandlingsReferanse: string,
  accessToken: string
): Promise<DetaljertBehandling> => {
  const url = `${saksbehandlingApiBaseUrl}/api/behandling/${behandlingsReferanse}`;
  try {
    return await fetchProxy<DetaljertBehandling>(url, accessToken, saksbehandlingScope, 'GET', undefined);
  } catch (e) {
    console.log(`Fant ikke behandling med referanse ${behandlingsReferanse}`);
    notFound();
  }
};

export const hentSak = async (saksnummer: string, accessToken: string): Promise<UtvidetSaksInfo> => {
  const url = `${saksbehandlingApiBaseUrl}/api/sak/${saksnummer}`;
  try {
    return await fetchProxy<UtvidetSaksInfo>(url, accessToken, saksbehandlingScope, 'GET', undefined);
  } catch (e) {
    console.log(`Fant ikke sak med referanse ${saksnummer}`);
    notFound();
  }
};

export const hentAlleSaker = async (accessToken: string): Promise<SaksInfo[]> => {
  const url = `${saksbehandlingApiBaseUrl}/api/sak/alle`;
  return await fetchProxy<SaksInfo[]>(url, accessToken, saksbehandlingScope, 'GET', undefined);
};

export const hentYrkesskadeGrunnlag = async (
  behandlingsReferanse: string,
  accessToken: string
): Promise<YrkesskadeGrunnlag> => {
  const url = `${saksbehandlingApiBaseUrl}/api/behandling/${behandlingsReferanse}/grunnlag/sykdom/yrkesskade`;
  return await fetchProxy<YrkesskadeGrunnlag>(url, accessToken, saksbehandlingScope, 'GET', undefined);
};

export const hentSykdomsGrunnlag = async (
  behandlingsReferanse: string,
  accessToken: string
): Promise<SykdomsGrunnlag> => {
  const url = `${saksbehandlingApiBaseUrl}/api/behandling/${behandlingsReferanse}/grunnlag/sykdom/sykdom`;
  return await fetchProxy<SykdomsGrunnlag>(url, accessToken, saksbehandlingScope, 'GET', undefined);
};

export const hentFlyt = async (
  behandlingsReferanse: string,
  accessToken: string
): Promise<BehandlingFlytOgTilstand> => {
  const url = `${saksbehandlingApiBaseUrl}/api/behandling/${behandlingsReferanse}/flyt`;
  return await fetchProxy<BehandlingFlytOgTilstand>(url, accessToken, saksbehandlingScope, 'GET', undefined);
};

export const hentFlyt2 = async (
  behandlingsReferanse: string,
  accessToken: string
): Promise<BehandlingFlytOgTilstand2> => {
  const url = `${saksbehandlingApiBaseUrl}/api/behandling/${behandlingsReferanse}/flyt-2`;
  return await fetchProxy<BehandlingFlytOgTilstand2>(url, accessToken, saksbehandlingScope, 'GET', undefined);
};

export const løsAvklaringsbehov = async (avklaringsBehov: LøsAvklaringsbehovPåBehandling, accessToken: string) => {
  const url = `${saksbehandlingApiBaseUrl}/api/behandling/løs-behov`;
  return await fetchProxy<void>(url, accessToken, saksbehandlingScope, 'POST', avklaringsBehov);
};

export const opprettTestSak = async (sak: OpprettTestcase, accessToken: string) => {
  const url = `${saksbehandlingApiBaseUrl}/test/opprett`;
  return await fetchProxy<void>(url, accessToken, saksbehandlingScope, 'POST', sak);
};
