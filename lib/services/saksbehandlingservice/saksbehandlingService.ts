import { notFound } from 'next/navigation';
import {
  BehandlingFlytOgTilstand,
  BehandlingResultat,
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
} from 'lib/types/types';
import { fetchProxy } from 'lib/services/fetchProxy';

const saksbehandlingApiBaseUrl = process.env.BEHANDLING_API_BASE_URL;
const saksbehandlingApiAudience = process.env.BEHANDLING_API_AUDIENCE ?? '';

export const hentBehandling = async (behandlingsReferanse: string): Promise<DetaljertBehandling> => {
  const url = `${saksbehandlingApiBaseUrl}/api/behandling/${behandlingsReferanse}`;
  try {
    return await fetchProxy<DetaljertBehandling>(url, saksbehandlingApiAudience, 'GET');
  } catch (e) {
    console.log(`Fant ikke behandling med referanse ${behandlingsReferanse}`);
    notFound();
  }
};

export const hentSak = async (saksnummer: string): Promise<UtvidetSaksInfo> => {
  const url = `${saksbehandlingApiBaseUrl}/api/sak/${saksnummer}`;
  try {
    return await fetchProxy<UtvidetSaksInfo>(url, saksbehandlingApiAudience, 'GET');
  } catch (e) {
    console.log(`Fant ikke sak med referanse ${saksnummer}`);
    notFound();
  }
};

export const hentAlleSaker = async (): Promise<SaksInfo[]> => {
  const url = `${saksbehandlingApiBaseUrl}/api/sak/alle`;
  return await fetchProxy<SaksInfo[]>(url, saksbehandlingApiAudience, 'GET');
};

export const hentStudentGrunnlag = async (behandlingsReferanse: string): Promise<StudentGrunnlag> => {
  const url = `${saksbehandlingApiBaseUrl}/api/behandling/${behandlingsReferanse}/grunnlag/student`;
  return await fetchProxy<StudentGrunnlag>(url, saksbehandlingApiAudience, 'GET');
};

export const hentSykdomsGrunnlag = async (behandlingsReferanse: string): Promise<SykdomsGrunnlag> => {
  const url = `${saksbehandlingApiBaseUrl}/api/behandling/${behandlingsReferanse}/grunnlag/sykdom/sykdom`;
  return await fetchProxy<SykdomsGrunnlag>(url, saksbehandlingApiAudience, 'GET');
};

export const hentUnntakMeldepliktGrunnlag = async (behandlingsReferanse: string): Promise<FritakMeldepliktGrunnlag> => {
  const url = `${saksbehandlingApiBaseUrl}/api/behandling/${behandlingsReferanse}/grunnlag/fritak-meldeplikt`;
  return await fetchProxy<FritakMeldepliktGrunnlag>(url, saksbehandlingApiAudience, 'GET');
};

export const hentBistandsbehovGrunnlag = async (behandlingsReferanse: string): Promise<BistandsGrunnlag> => {
  const url = `${saksbehandlingApiBaseUrl}/api/behandling/${behandlingsReferanse}/grunnlag/bistand`;
  return await fetchProxy<BistandsGrunnlag>(url, saksbehandlingApiAudience, 'GET');
};

export const hentFatteVedtakGrunnlang = async (behandlingsReferanse: string): Promise<FatteVedtakGrunnlag> => {
  const url = `${saksbehandlingApiBaseUrl}/api/behandling/${behandlingsReferanse}/grunnlag/fatte-vedtak`;
  return await fetchProxy<FatteVedtakGrunnlag>(url, saksbehandlingApiAudience, 'GET');
};

export const hentFlyt = async (behandlingsReferanse: string): Promise<BehandlingFlytOgTilstand> => {
  const url = `${saksbehandlingApiBaseUrl}/api/behandling/${behandlingsReferanse}/flyt`;
  return await fetchProxy<BehandlingFlytOgTilstand>(url, saksbehandlingApiAudience, 'GET');
};

export const løsAvklaringsbehov = async (avklaringsBehov: LøsAvklaringsbehovPåBehandling) => {
  const url = `${saksbehandlingApiBaseUrl}/api/behandling/løs-behov`;
  return await fetchProxy<void>(url, saksbehandlingApiAudience, 'POST', avklaringsBehov);
};

export const opprettTestSak = async (sak: OpprettTestcase) => {
  const url = `${saksbehandlingApiBaseUrl}/test/opprett`;
  return await fetchProxy<void>(url, saksbehandlingApiAudience, 'POST', sak);
};

export const hentResultat = async (referanse: string): Promise<BehandlingResultat> => {
  const url = `${saksbehandlingApiBaseUrl}/api/behandling/${referanse}/resultat`;
  return await fetchProxy<BehandlingResultat>(url, saksbehandlingApiAudience, 'GET');
};
