import { notFound } from 'next/navigation';
import {
  BehandlingFlytOgTilstand,
  BehandlingResultat,
  BeregningsGrunnlag,
  BeregningsVurdering,
  BistandsGrunnlag,
  DetaljertBehandling,
  FatteVedtakGrunnlag,
  FritakMeldepliktGrunnlag,
  LøsAvklaringsbehovPåBehandling,
  OpprettTestcase,
  SakPersoninfo,
  SaksInfo,
  SettPåVent,
  StudentGrunnlag,
  SykdomsGrunnlag,
  SykepengeerstatningGrunnlag,
  TilkjentYtelseGrunnlag,
  VenteInformasjon,
} from 'lib/types/types';
import { fetchProxy } from 'lib/services/fetchProxy';
import { logWarning } from '@navikt/aap-felles-utils';

const saksbehandlingApiBaseUrl = process.env.BEHANDLING_API_BASE_URL;
const saksbehandlingApiScope = process.env.BEHANDLING_API_SCOPE ?? '';

export const hentBehandling = async (behandlingsReferanse: string): Promise<DetaljertBehandling> => {
  const url = `${saksbehandlingApiBaseUrl}/api/behandling/${behandlingsReferanse}`;
  try {
    return await fetchProxy<DetaljertBehandling>(url, saksbehandlingApiScope, 'GET');
  } catch (e) {
    logWarning(`Fant ikke behandling med referanse ${behandlingsReferanse}`);
    notFound();
  }
};

export const hentSak = async (saksnummer: string): Promise<SaksInfo> => {
  const url = `${saksbehandlingApiBaseUrl}/api/sak/${saksnummer}`;
  try {
    return await fetchProxy<SaksInfo>(url, saksbehandlingApiScope, 'GET');
  } catch (e) {
    logWarning(`Fant ikke sak med referanse ${saksnummer}`);
    notFound();
  }
};
export const hentSakPersoninfo = async (saksnummer: string): Promise<SakPersoninfo> => {
  const url = `${saksbehandlingApiBaseUrl}/api/sak/${saksnummer}/personinformasjon`;
  try {
    return await fetchProxy<SakPersoninfo>(url, saksbehandlingApiScope, 'GET');
  } catch (e) {
    logWarning(`Fant ikke sak med referanse ${saksnummer}`);
    notFound();
  }
};

export const hentAlleSaker = async (): Promise<SaksInfo[]> => {
  const url = `${saksbehandlingApiBaseUrl}/api/sak/alle`;
  return await fetchProxy<SaksInfo[]>(url, saksbehandlingApiScope, 'GET');
};

export const hentStudentGrunnlag = async (behandlingsReferanse: string): Promise<StudentGrunnlag> => {
  const url = `${saksbehandlingApiBaseUrl}/api/behandling/${behandlingsReferanse}/grunnlag/student`;
  return await fetchProxy<StudentGrunnlag>(url, saksbehandlingApiScope, 'GET');
};

export const hentSykdomsGrunnlag = async (behandlingsReferanse: string): Promise<SykdomsGrunnlag> => {
  const url = `${saksbehandlingApiBaseUrl}/api/behandling/${behandlingsReferanse}/grunnlag/sykdom/sykdom`;
  return await fetchProxy<SykdomsGrunnlag>(url, saksbehandlingApiScope, 'GET');
};

export const hentSykepengerErstatningGrunnlag = async (
  behandlingsReferanse: string
): Promise<SykepengeerstatningGrunnlag> => {
  const url = `${saksbehandlingApiBaseUrl}/api/behandling/${behandlingsReferanse}/grunnlag/sykdom/sykepengergrunnlag`;
  return await fetchProxy<SykepengeerstatningGrunnlag>(url, saksbehandlingApiScope, 'GET');
};
export const hentUnntakMeldepliktGrunnlag = async (behandlingsReferanse: string): Promise<FritakMeldepliktGrunnlag> => {
  const url = `${saksbehandlingApiBaseUrl}/api/behandling/${behandlingsReferanse}/grunnlag/fritak-meldeplikt`;
  return await fetchProxy<FritakMeldepliktGrunnlag>(url, saksbehandlingApiScope, 'GET');
};

export const hentBistandsbehovGrunnlag = async (behandlingsReferanse: string): Promise<BistandsGrunnlag> => {
  const url = `${saksbehandlingApiBaseUrl}/api/behandling/${behandlingsReferanse}/grunnlag/bistand`;
  return await fetchProxy<BistandsGrunnlag>(url, saksbehandlingApiScope, 'GET');
};

export const hentFatteVedtakGrunnlang = async (behandlingsReferanse: string): Promise<FatteVedtakGrunnlag> => {
  const url = `${saksbehandlingApiBaseUrl}/api/behandling/${behandlingsReferanse}/grunnlag/fatte-vedtak`;
  return await fetchProxy<FatteVedtakGrunnlag>(url, saksbehandlingApiScope, 'GET');
};

export const hentBeregningsVurdering = async (behandlingsReferanse: string): Promise<BeregningsVurdering> => {
  const url = `${saksbehandlingApiBaseUrl}/api/behandling/${behandlingsReferanse}/grunnlag/beregningsvurdering`;
  return await fetchProxy<BeregningsVurdering>(url, saksbehandlingApiScope, 'GET');
};
export const hentTilkjentYtelse = async (behandlingsReferanse: string): Promise<TilkjentYtelseGrunnlag> => {
  const url = `${saksbehandlingApiBaseUrl}/api/behandling/tilkjent/${behandlingsReferanse}`;
  return await fetchProxy<TilkjentYtelseGrunnlag>(url, saksbehandlingApiScope, 'GET');
};
export const hentFlyt = async (behandlingsReferanse: string): Promise<BehandlingFlytOgTilstand> => {
  const url = `${saksbehandlingApiBaseUrl}/api/behandling/${behandlingsReferanse}/flyt`;
  return await fetchProxy<BehandlingFlytOgTilstand>(url, saksbehandlingApiScope, 'GET');
};

export const løsAvklaringsbehov = async (avklaringsBehov: LøsAvklaringsbehovPåBehandling) => {
  const url = `${saksbehandlingApiBaseUrl}/api/behandling/løs-behov`;
  return await fetchProxy<void>(url, saksbehandlingApiScope, 'POST', avklaringsBehov);
};

export const opprettTestSak = async (sak: OpprettTestcase) => {
  const url = `${saksbehandlingApiBaseUrl}/test/opprett`;
  return await fetchProxy<void>(url, saksbehandlingApiScope, 'POST', sak);
};

export const hentResultat = async (referanse: string): Promise<BehandlingResultat> => {
  const url = `${saksbehandlingApiBaseUrl}/api/behandling/${referanse}/resultat`;
  return await fetchProxy<BehandlingResultat>(url, saksbehandlingApiScope, 'GET');
};

export const rekjørFeiledeOppgaver = async () => {
  const url = `${saksbehandlingApiBaseUrl}/test/rekjorFeilede`;
  return await fetchProxy<void>(url, saksbehandlingApiScope, 'GET');
};

export const hentBeregningsGrunnlag = async (referanse: string) => {
  const url = `${saksbehandlingApiBaseUrl}/api/beregning/grunnlag/${referanse}`;
  return await fetchProxy<BeregningsGrunnlag>(url, saksbehandlingApiScope, 'GET');
};

export const settBehandlingPåVent = async (referanse: string, requestBody: SettPåVent) => {
  const url = `${saksbehandlingApiBaseUrl}/api/behandling/${referanse}/sett-på-vent`;
  return await fetchProxy(url, saksbehandlingApiScope, 'POST', requestBody);
};

export const hentBehandlingPåVentInformasjon = async (referanse: string) => {
  const url = `${saksbehandlingApiBaseUrl}/api/behandling/${referanse}/vente-informasjon`;
  return await fetchProxy<VenteInformasjon>(url, saksbehandlingApiScope, 'GET');
};
