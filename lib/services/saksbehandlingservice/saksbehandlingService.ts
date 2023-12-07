import { notFound } from 'next/navigation';
import {
  BehandlingFlytOgTilstand,
  BistandsGrunnlag,
  DetaljertBehandling,
  FatteVedtakGrunnlag,
  FritakMeldepliktGrunnlag,
  LøsAvklaringsbehovPåBehandling,
  OpprettTestcase,
  SaksInfo,
  StudentGrunnlag,
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

export const hentStudentGrunnlag = async (
  behandlingsReferanse: string,
  accessToken: string
): Promise<StudentGrunnlag> => {
  const url = `${saksbehandlingApiBaseUrl}/api/behandling/${behandlingsReferanse}/grunnlag/student`;
  return await fetchProxy<StudentGrunnlag>(url, accessToken, saksbehandlingScope, 'GET', undefined);
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

export const hentUnntakMeldepliktGrunnlag = async (
  behandlingsReferanse: string,
  accessToken: string
): Promise<FritakMeldepliktGrunnlag> => {
  const url = `${saksbehandlingApiBaseUrl}/api/behandling/${behandlingsReferanse}/grunnlag/fritak-meldeplikt`;
  return await fetchProxy<FritakMeldepliktGrunnlag>(url, accessToken, saksbehandlingScope, 'GET', undefined);
};

export const hentBistandsbehovGrunnlag = async (
  behandlingsReferanse: string,
  accessToken: string
): Promise<BistandsGrunnlag> => {
  const url = `${saksbehandlingApiBaseUrl}/api/behandling/${behandlingsReferanse}/grunnlag/bistand`;
  return await fetchProxy<BistandsGrunnlag>(url, accessToken, saksbehandlingScope, 'GET', undefined);
};

export const hentFatteVedtakGrunnlang = async (
  behandlingsReferanse: string,
  accessToken: string
): Promise<FatteVedtakGrunnlag> => {
  const url = `${saksbehandlingApiBaseUrl}/api/behandling/${behandlingsReferanse}/grunnlag/fatte-vedtak`;
  return await fetchProxy<FatteVedtakGrunnlag>(url, accessToken, saksbehandlingScope, 'GET', undefined);
};

export const hentFlyt2 = async (
  behandlingsReferanse: string,
  accessToken: string
): Promise<BehandlingFlytOgTilstand> => {
  const url = `${saksbehandlingApiBaseUrl}/api/behandling/${behandlingsReferanse}/flyt-2`;
  return await fetchProxy<BehandlingFlytOgTilstand>(url, accessToken, saksbehandlingScope, 'GET', undefined);
};

export const løsAvklaringsbehov = async (avklaringsBehov: LøsAvklaringsbehovPåBehandling, accessToken: string) => {
  const url = `${saksbehandlingApiBaseUrl}/api/behandling/løs-behov`;
  return await fetchProxy<void>(url, accessToken, saksbehandlingScope, 'POST', avklaringsBehov);
};

export const opprettTestSak = async (sak: OpprettTestcase, accessToken: string) => {
  const url = `${saksbehandlingApiBaseUrl}/test/opprett`;
  return await fetchProxy<void>(url, accessToken, saksbehandlingScope, 'POST', sak);
};
