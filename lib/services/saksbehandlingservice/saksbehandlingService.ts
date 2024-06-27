import { notFound } from 'next/navigation';
import {
  AktivitetInnsendingDto,
  AlderGrunnlag,
  BehandlingFlytOgTilstand,
  BehandlingResultat,
  BeregningsGrunnlag,
  BeregningsVurdering,
  BistandsGrunnlag,
  DetaljertBehandling,
  FatteVedtakGrunnlag,
  FritakMeldepliktGrunnlag,
  JobbInfo,
  KvalitetssikringGrunnlag,
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
import { fetchProxy, fetchPdf } from 'lib/services/fetchProxy';
import { logError, logWarning } from '@navikt/aap-felles-utils';

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
  // TODO: bruk backend når vi får ordnet opp i lokal auth
  console.log(saksnummer);
  const mockResponse: SakPersoninfo = {
    fnr: '123456 78999',
    navn: 'Peter Ås',
  };
  return Promise.resolve(mockResponse);

  // const url = `${saksbehandlingApiBaseUrl}/api/sak/${saksnummer}/personinformasjon`;
  // try {
  //   return await fetchProxy<SakPersoninfo>(url, saksbehandlingApiScope, 'GET');
  // } catch (e) {
  //   logWarning(`Fant ikke sak med referanse ${saksnummer}`);
  //   notFound();
  // }
};

export const sendAktivitetsMelding = async (aktivitet: AktivitetInnsendingDto) => {
  const url = `${saksbehandlingApiBaseUrl}/api/hammer/send`;
  return await fetchProxy<{}>(url, saksbehandlingApiScope, 'POST', aktivitet);
};

export const hentAktivitetsMeldinger = async (saksnummer: string) => {
  const url = `${saksbehandlingApiBaseUrl}/api/hammer/${saksnummer}`;
  return await fetchProxy<Array<AktivitetInnsendingDto>>(url, saksbehandlingApiScope, 'GET');
};

export const hentAlleSaker = async (): Promise<SaksInfo[]> => {
  const url = `${saksbehandlingApiBaseUrl}/api/sak/alle`;
  return await fetchProxy<SaksInfo[]>(url, saksbehandlingApiScope, 'GET');
};

export const hentAlleDokumenterPåSak = async (saksnummer: string) => {
  const url = `${saksbehandlingApiBaseUrl}/api/sak/${saksnummer}/dokumenter`;
  return await fetchProxy(url, saksbehandlingApiScope, 'GET');
};

export const hentDokument = async (journalPostId: string, dokumentInfoId: string) => {
  const url = `${saksbehandlingApiBaseUrl}/api/sak/dokument/${journalPostId}/${dokumentInfoId}`;
  return await fetchPdf(url, saksbehandlingApiScope);
};

export const hentStudentGrunnlag = async (behandlingsReferanse: string): Promise<StudentGrunnlag> => {
  const url = `${saksbehandlingApiBaseUrl}/api/behandling/${behandlingsReferanse}/grunnlag/student`;
  return await fetchProxy<StudentGrunnlag>(url, saksbehandlingApiScope, 'GET');
};

export const hentSykdomsGrunnlag = async (behandlingsReferanse: string): Promise<SykdomsGrunnlag> => {
  const url = `${saksbehandlingApiBaseUrl}/api/behandling/${behandlingsReferanse}/grunnlag/sykdom/sykdom`;
  return await fetchProxy<SykdomsGrunnlag>(url, saksbehandlingApiScope, 'GET');
};

export const hentKvalitetssikringGrunnlag = async (behandlingsReferanse: string) => {
  const url = `${saksbehandlingApiBaseUrl}/api/behandling/${behandlingsReferanse}/grunnlag/kvalitetssikring`;
  return await fetchProxy<KvalitetssikringGrunnlag>(url, saksbehandlingApiScope, 'GET');
};

export const hentSykepengerErstatningGrunnlag = async (
  behandlingsReferanse: string
): Promise<SykepengeerstatningGrunnlag> => {
  const url = `${saksbehandlingApiBaseUrl}/api/behandling/${behandlingsReferanse}/grunnlag/sykdom/sykepengergrunnlag`;
  return await fetchProxy<SykepengeerstatningGrunnlag>(url, saksbehandlingApiScope, 'GET');
};

export const hentAlderGrunnlag = async (behandlingsReferanse: string): Promise<AlderGrunnlag> => {
  const url = `${saksbehandlingApiBaseUrl}/api/behandling/${behandlingsReferanse}/grunnlag/alder`;
  return await fetchProxy<AlderGrunnlag>(url, saksbehandlingApiScope, 'GET');
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

export const hentBeregningsGrunnlagMock = async () => {
  return mockBeregningsGrunnlag;
};

export const settBehandlingPåVent = async (referanse: string, requestBody: SettPåVent) => {
  const url = `${saksbehandlingApiBaseUrl}/api/behandling/${referanse}/sett-på-vent`;
  return await fetchProxy(url, saksbehandlingApiScope, 'POST', requestBody);
};

export const hentBehandlingPåVentInformasjon = async (referanse: string) => {
  const url = `${saksbehandlingApiBaseUrl}/api/behandling/${referanse}/vente-informasjon`;
  return await fetchProxy<VenteInformasjon>(url, saksbehandlingApiScope, 'GET');
};

export const hentLocalToken = async () => {
  const url = 'http://localhost:8081/token';
  try {
    return fetch(url, { method: 'POST', next: { revalidate: 0 } })
      .then((res) => res.json())
      .then((data) => data?.access_token);
  } catch (err) {
    logError('hentLocalToken feilet', err);
    return Promise.resolve('dummy-token');
  }
};

export const hentFeilendeJObber = async () => {
  const url = `${saksbehandlingApiBaseUrl}/drift/api/jobb/feilende`;
  return await fetchProxy<JobbInfo[]>(url, saksbehandlingApiScope, 'GET');
};

export const hentPlanlagteJobber = async () => {
  const url = `${saksbehandlingApiBaseUrl}/drift/api/jobb/planlagte-jobber`;
  return await fetchProxy<JobbInfo[]>(url, saksbehandlingApiScope, 'GET');
};

export const rekjørJobb = async (jobbId: string) => {
  const url = `${saksbehandlingApiBaseUrl}/drift/api/jobb/rekjor/${jobbId}`;
  return await fetchProxy<string>(url, saksbehandlingApiScope, 'GET');
};

export interface MockBeregeningsGrunnlag {
  beregningsGrunnlag: string;
  faktagrunnlag: string;
  nedsattArbeidsevneÅr: string;
  inntekterFraForegåendeÅr: string;
  inntektIKroner: string;
  inntektIG: string;
  er6GBegrenset: string;
  erDetBruktGjennomsnitt: string;

  antattÅrligInntektYrkesskadetidspunkt: string;
  yrkesskadetidspunkt: string;
  TerskelverdiForYrkesskadefordel: string;
  AndelYrkesskade: string;
  BenyttetAndelYrkesskade: string;
  InntektPåYrkesskadetidspunkt: string;
  YrkesskadeinntektIG: string;
  grunnlagForBeregningAvYrkesskadeandel: string;
  andelSomSkyldesYrkesskade: string;
  andelSomIkkeSkyldesYrkesskade: string;
  grunnlagEtterYrkesskadefordel: string;

  uføreYtterligereNedsattArbeidsevneÅr: string;
  uføreInntekterFraForegåendeÅr: string;
  uføregrad: string; //Liste? Avhengig av om vi skal se på grad over tid
  uføreOppjusterteInntekter: string;
  uføreInntektIKroner: string;
  uføreInntektIG: string;
  uføreEr6GBegrenset: string;
  uføreErDetBruktGjennomsnitt: string;
}

const mockBeregningsGrunnlag: MockBeregeningsGrunnlag = {
  AndelYrkesskade: '',
  BenyttetAndelYrkesskade: '',
  InntektPåYrkesskadetidspunkt: '',
  TerskelverdiForYrkesskadefordel: '',
  YrkesskadeinntektIG: '',
  andelSomIkkeSkyldesYrkesskade: '',
  andelSomSkyldesYrkesskade: '',
  antattÅrligInntektYrkesskadetidspunkt: '',
  beregningsGrunnlag: '',
  er6GBegrenset: '',
  erDetBruktGjennomsnitt: '',
  faktagrunnlag: '',
  grunnlagEtterYrkesskadefordel: '',
  grunnlagForBeregningAvYrkesskadeandel: '',
  inntektIG: '',
  inntektIKroner: '',
  inntekterFraForegåendeÅr: '',
  nedsattArbeidsevneÅr: '',
  uføreEr6GBegrenset: '',
  uføreErDetBruktGjennomsnitt: '',
  uføreInntektIG: '',
  uføreInntektIKroner: '',
  uføreInntekterFraForegåendeÅr: '',
  uføreOppjusterteInntekter: '',
  uføreYtterligereNedsattArbeidsevneÅr: '',
  uføregrad: '',
  yrkesskadetidspunkt: '',
};
