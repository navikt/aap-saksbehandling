import { notFound } from 'next/navigation';
import {
  AktivitetspliktGrunnlag,
  AktivitetspliktHendelser,
  AlderGrunnlag,
  ArbeidsevneGrunnlag,
  AutomatiskLovvalgOgMedlemskapVurdering,
  BarnetilleggGrunnlag,
  BehandlingFlytOgTilstand,
  BehandlingPersoninfo,
  BehandlingResultat,
  BeregningsGrunnlag,
  BeregningTidspunktGrunnlag,
  BestillLegeerklæring,
  BistandsGrunnlag,
  Brev,
  BrevGrunnlag,
  DetaljertBehandling,
  DokumentInfo,
  FatteVedtakGrunnlag,
  FlytProsessering,
  ForhåndsvisDialogmelding,
  ForhåndsvisDialogmeldingResponse,
  ForutgåendeMedlemskapGrunnlag,
  FritakMeldepliktGrunnlag,
  HelseinstitusjonGrunnlag,
  KvalitetssikringGrunnlag,
  LegeerklæringStatus,
  LovvalgMedlemskapGrunnlag,
  LøsAvklaringsbehovPåBehandling,
  MedlemskapGrunnlag,
  OppdaterAktivitetspliktBrudd2,
  OpprettAktivitetspliktBrudd,
  OpprettTestcase,
  SakPersoninfo,
  SaksInfo,
  SamordningGraderingGrunnlag,
  SamordningUføreGrunnlag,
  SettPåVent,
  SimulerMeldeplikt,
  SimulertMeldeplikt,
  Soningsgrunnlag,
  StudentGrunnlag,
  SykdomsGrunnlag,
  SykepengeerstatningGrunnlag,
  TilkjentYtelseGrunnlag,
  UnderveisGrunnlag,
  VenteInformasjon,
  YrkeskadeBeregningGrunnlag,
  YrkesskadeVurderingGrunnlag,
} from 'lib/types/types';
import { fetchPdf, fetchProxy } from 'lib/services/fetchProxy';
import { logError, logInfo, logWarning } from '@navikt/aap-felles-utils';
import { headers } from 'next/headers';
import { apiFetch } from 'lib/services/apiFetch';
import { isLocal } from 'lib/utils/environment';

const saksbehandlingApiBaseUrl = process.env.BEHANDLING_API_BASE_URL;
const saksbehandlingApiScope = process.env.BEHANDLING_API_SCOPE ?? '';

export const hentBehandling = async (behandlingsReferanse: string): Promise<DetaljertBehandling> => {
  const url = `${saksbehandlingApiBaseUrl}/api/behandling/${behandlingsReferanse}`;
  try {
    return await fetchProxy<DetaljertBehandling>(url, saksbehandlingApiScope, 'GET');
  } catch (e) {
    logWarning(`Fant ikke behandling med referanse ${behandlingsReferanse}`, JSON.stringify(e));
    notFound();
  }
};

export const hentSak = async (saksnummer: string): Promise<SaksInfo> => {
  const url = `${saksbehandlingApiBaseUrl}/api/sak/${saksnummer}`;
  try {
    return await fetchProxy<SaksInfo>(url, saksbehandlingApiScope, 'GET');
  } catch (e) {
    logWarning(`Fant ikke sak med referanse ${saksnummer}`, JSON.stringify(e));
    notFound();
  }
};

export const hentSakPersoninfo = async (saksnummer: string): Promise<SakPersoninfo> => {
  const url = `${saksbehandlingApiBaseUrl}/api/sak/${saksnummer}/personinformasjon`;
  return await fetchProxy<SakPersoninfo>(url, saksbehandlingApiScope, 'GET');
};

export const hentBehandlingPersoninfo = async (behandlingsreferanse: string): Promise<BehandlingPersoninfo> => {
  const url = `${saksbehandlingApiBaseUrl}/api/behandling/${behandlingsreferanse}/personinformasjon`;
  return await fetchProxy<BehandlingPersoninfo>(url, saksbehandlingApiScope, 'GET');
};

export const opprettBruddPåAktivitetsplikten = async (saksnummer: string, aktivitet: OpprettAktivitetspliktBrudd) => {
  const url = `${saksbehandlingApiBaseUrl}/api/sak/${saksnummer}/aktivitetsplikt/opprett`;
  return await fetchProxy<{}>(url, saksbehandlingApiScope, 'POST', aktivitet);
};

export const oppdaterBruddPåAktivitetsplikten = async (
  saksnummer: string,
  aktivitet: OppdaterAktivitetspliktBrudd2
) => {
  const url = `${saksbehandlingApiBaseUrl}/api/sak/${saksnummer}/aktivitetsplikt/oppdater`;
  return await fetchProxy<{}>(url, saksbehandlingApiScope, 'POST', aktivitet);
};

export const hentAktivitetspliktHendelser = async (saksnummer: string) => {
  const url = `${saksbehandlingApiBaseUrl}/api/sak/${saksnummer}/aktivitetsplikt`;
  return await fetchProxy<AktivitetspliktHendelser>(url, saksbehandlingApiScope, 'GET', undefined, [
    `aktivitetsplikt/${saksnummer}`,
  ]);
};

export const finnSakerForIdent = async (ident: string): Promise<SaksInfo[]> => {
  const url = `${saksbehandlingApiBaseUrl}/api/sak/finn`;
  return await fetchProxy<SaksInfo[]>(url, saksbehandlingApiScope, 'POST', { ident });
};
export const hentAlleSaker = async (): Promise<SaksInfo[]> => {
  const url = `${saksbehandlingApiBaseUrl}/api/sak/alle`;
  return await fetchProxy<SaksInfo[]>(url, saksbehandlingApiScope, 'GET');
};

export const hentAlleDokumenterPåSak = async (saksnummer: string): Promise<DokumentInfo[]> => {
  const url = `${saksbehandlingApiBaseUrl}/api/sak/${saksnummer}/dokumenter`;
  return await fetchProxy(url, saksbehandlingApiScope, 'GET');
};

export const hentLesetilgang = async (saksnummer: string) => {
  const url = `${saksbehandlingApiBaseUrl}/api/sak/${saksnummer}/lesetilgang`;
  return await fetchProxy(url, saksbehandlingApiScope, 'GET');
};

export const hentDokument = async (journalPostId: string, dokumentInfoId: string) => {
  const url = `${saksbehandlingApiBaseUrl}/api/sak/dokument/${journalPostId}/${dokumentInfoId}`;
  return await fetchPdf(url, saksbehandlingApiScope);
};

export const hentMedlemskapGrunnlag = async (behandlingsReferanse: string): Promise<MedlemskapGrunnlag> => {
  const url = `${saksbehandlingApiBaseUrl}/api/behandling/${behandlingsReferanse}/grunnlag/medlemskap`;
  return await fetchProxy<MedlemskapGrunnlag>(url, saksbehandlingApiScope, 'GET');
};

export const hentYrkesskadeVurderingGrunnlag = async (
  behandlingsReferanse: string
): Promise<YrkesskadeVurderingGrunnlag> => {
  const url = `${saksbehandlingApiBaseUrl}/api/behandling/${behandlingsReferanse}/grunnlag/sykdom/yrkesskade`;
  return await fetchProxy<YrkesskadeVurderingGrunnlag>(url, saksbehandlingApiScope, 'GET');
};

export const hentStudentGrunnlag = async (behandlingsReferanse: string): Promise<StudentGrunnlag> => {
  const url = `${saksbehandlingApiBaseUrl}/api/behandling/${behandlingsReferanse}/grunnlag/student`;
  return await fetchProxy<StudentGrunnlag>(url, saksbehandlingApiScope, 'GET');
};

export const hentSykdomsGrunnlag = async (behandlingsReferanse: string): Promise<SykdomsGrunnlag> => {
  const url = `${saksbehandlingApiBaseUrl}/api/behandling/${behandlingsReferanse}/grunnlag/sykdom/sykdom`;
  return await fetchProxy<SykdomsGrunnlag>(url, saksbehandlingApiScope, 'GET');
};

export const hentBarnetilleggGrunnlag = async (behandlingsreferanse: string): Promise<BarnetilleggGrunnlag> => {
  const url = `${saksbehandlingApiBaseUrl}/api/barnetillegg/grunnlag/${behandlingsreferanse}`;
  return await fetchProxy<BarnetilleggGrunnlag>(url, saksbehandlingApiScope, 'GET');
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

export const hentFastsettArbeidsevneGrunnlag = async (behandlingsReferanse: string): Promise<ArbeidsevneGrunnlag> => {
  const url = `${saksbehandlingApiBaseUrl}/api/behandling/${behandlingsReferanse}/grunnlag/arbeidsevne`;
  return await fetchProxy<ArbeidsevneGrunnlag>(url, saksbehandlingApiScope, 'GET');
};

export const hentBistandsbehovGrunnlag = async (behandlingsReferanse: string): Promise<BistandsGrunnlag> => {
  const url = `${saksbehandlingApiBaseUrl}/api/behandling/${behandlingsReferanse}/grunnlag/bistand`;
  return await fetchProxy<BistandsGrunnlag>(url, saksbehandlingApiScope, 'GET');
};

export const hentFatteVedtakGrunnlang = async (behandlingsReferanse: string): Promise<FatteVedtakGrunnlag> => {
  const url = `${saksbehandlingApiBaseUrl}/api/behandling/${behandlingsReferanse}/grunnlag/fatte-vedtak`;
  return await fetchProxy<FatteVedtakGrunnlag>(url, saksbehandlingApiScope, 'GET');
};

export const hentBrevGrunnlag = async (behandlingsReferanse: string): Promise<BrevGrunnlag> => {
  const url = `${saksbehandlingApiBaseUrl}/api/behandling/${behandlingsReferanse}/grunnlag/brev`;
  return await fetchProxy<BrevGrunnlag>(url, saksbehandlingApiScope, 'GET');
};

export const hentLovvalgMedlemskapGrunnlag = async (
  behandlingsReferanse: string
): Promise<LovvalgMedlemskapGrunnlag> => {
  const url = `${saksbehandlingApiBaseUrl}/api/behandling/${behandlingsReferanse}/grunnlag/lovvalgmedlemskap`;
  return await fetchProxy<LovvalgMedlemskapGrunnlag>(url, saksbehandlingApiScope, 'GET');
};

export const hentForutgåendeMedlemskapGrunnlag = async (
  behandlingsReferanse: string
): Promise<ForutgåendeMedlemskapGrunnlag> => {
  const url = `${saksbehandlingApiBaseUrl}/api/behandling/${behandlingsReferanse}/grunnlag/forutgaaendemedlemskap`;
  return await fetchProxy<ForutgåendeMedlemskapGrunnlag>(url, saksbehandlingApiScope, 'GET');
};

export const hentSamordningGraderingGrunnlag = async (
  behandlingsReferanse: string
): Promise<SamordningGraderingGrunnlag> => {
  const url = `${saksbehandlingApiBaseUrl}/api/behandling/${behandlingsReferanse}/grunnlag/samordning`;
  return await fetchProxy<SamordningGraderingGrunnlag>(url, saksbehandlingApiScope, 'GET');
};

export const hentSamordningUføreGrunnlag = async (behandlingsReferanse: string): Promise<SamordningUføreGrunnlag> => {
  if (isLocal()) {
    return {
      vurdering: {
        begrunnelse: 'jkl',
        vurderingPerioder: [],
      },
      grunnlag: [
        {
          kilde: 'PESYS',
          virkningstidspunkt: '2025-01-01',
          uføregrad: 40,
        },
      ],
    };
  }
  const url = `${saksbehandlingApiBaseUrl}/api/behandling/${behandlingsReferanse}/grunnlag/samordning-ufore`;
  return await fetchProxy<SamordningUføreGrunnlag>(url, saksbehandlingApiScope, 'GET');
};

export const hentBeregningstidspunktVurdering = async (
  behandlingsReferanse: string
): Promise<BeregningTidspunktGrunnlag> => {
  const url = `${saksbehandlingApiBaseUrl}/api/behandling/${behandlingsReferanse}/grunnlag/beregning/tidspunkt`;
  return await fetchProxy<BeregningTidspunktGrunnlag>(url, saksbehandlingApiScope, 'GET');
};

export const hentBeregningYrkesskadeVurdering = async (
  behandlingsReferanse: string
): Promise<YrkeskadeBeregningGrunnlag> => {
  const url = `${saksbehandlingApiBaseUrl}/api/behandling/${behandlingsReferanse}/grunnlag/beregning/yrkesskade`;
  return await fetchProxy<YrkeskadeBeregningGrunnlag>(url, saksbehandlingApiScope, 'GET');
};

export const hentHelseInstitusjonsVurdering = async (
  behandlingsReferanse: string
): Promise<HelseinstitusjonGrunnlag> => {
  const url = `${saksbehandlingApiBaseUrl}/api/behandling/${behandlingsReferanse}/grunnlag/institusjon/helse`;
  return fetchProxy<HelseinstitusjonGrunnlag>(url, saksbehandlingApiScope, 'GET');
};

export const hentSoningsvurdering = async (behandlingsreferanse: string): Promise<Soningsgrunnlag> => {
  const url = `${saksbehandlingApiBaseUrl}/api/behandling/${behandlingsreferanse}/grunnlag/institusjon/soning`;
  return fetchProxy<Soningsgrunnlag>(url, saksbehandlingApiScope, 'GET');
};

export const hentTilkjentYtelse = async (behandlingsReferanse: string): Promise<TilkjentYtelseGrunnlag> => {
  const url = `${saksbehandlingApiBaseUrl}/api/behandling/tilkjent/${behandlingsReferanse}`;
  return await fetchProxy<TilkjentYtelseGrunnlag>(url, saksbehandlingApiScope, 'GET');
};
export const hentFlyt = async (behandlingsReferanse: string): Promise<BehandlingFlytOgTilstand> => {
  const url = `${saksbehandlingApiBaseUrl}/api/behandling/${behandlingsReferanse}/flyt`;
  return await fetchProxy<BehandlingFlytOgTilstand>(url, saksbehandlingApiScope, 'GET', undefined, [
    `flyt/${behandlingsReferanse}`,
  ]);
};

export const løsAvklaringsbehov = async (avklaringsBehov: LøsAvklaringsbehovPåBehandling) => {
  const url = `${saksbehandlingApiBaseUrl}/api/behandling/løs-behov`;
  return await apiFetch<void>(url, saksbehandlingApiScope, 'POST', avklaringsBehov);
};

export const mellomlagreBrev = async (brevbestillingReferanse: string, brev: Brev) => {
  const url = `${saksbehandlingApiBaseUrl}/api/brev/${brevbestillingReferanse}/oppdater`;
  return await fetchProxy<void>(url, saksbehandlingApiScope, 'PUT', brev);
};

export const opprettTestSak = async (sak: OpprettTestcase) => {
  const url = `${saksbehandlingApiBaseUrl}/test/opprett`;
  return await fetchProxy<void>(url, saksbehandlingApiScope, 'POST', sak);
};

export const bestillTestBrev = async (bestilling: { behandlingReferanse: string }) => {
  const url = `${saksbehandlingApiBaseUrl}/test/brev`;
  return await fetchProxy<void>(url, saksbehandlingApiScope, 'POST', bestilling);
};

export const hentResultat = async (referanse: string): Promise<BehandlingResultat> => {
  const url = `${saksbehandlingApiBaseUrl}/api/behandling/${referanse}/resultat`;
  return await fetchProxy<BehandlingResultat>(url, saksbehandlingApiScope, 'GET');
};

export const hentBeregningsGrunnlag = async (referanse: string) => {
  const url = `${saksbehandlingApiBaseUrl}/api/beregning/grunnlag/${referanse}`;
  return await fetchProxy<BeregningsGrunnlag>(url, saksbehandlingApiScope, 'GET');
};

export const simulerMeldeplikt = async (referanse: string, requestBody: SimulerMeldeplikt) => {
  const url = `${saksbehandlingApiBaseUrl}/api/behandling/${referanse}/grunnlag/fritak-meldeplikt/simulering`;
  return await fetchProxy<SimulertMeldeplikt>(url, saksbehandlingApiScope, 'POST', requestBody);
};

export const settBehandlingPåVent = async (referanse: string, requestBody: SettPåVent) => {
  const url = `${saksbehandlingApiBaseUrl}/api/behandling/${referanse}/sett-på-vent`;
  return await fetchProxy(url, saksbehandlingApiScope, 'POST', requestBody);
};

export const hentBehandlingPåVentInformasjon = async (referanse: string) => {
  const url = `${saksbehandlingApiBaseUrl}/api/behandling/${referanse}/vente-informasjon`;
  return await fetchProxy<VenteInformasjon>(url, saksbehandlingApiScope, 'GET');
};

export const forberedBehandlingOgVentPåProsessering = async (
  referanse: string
): Promise<undefined | FlytProsessering> => {
  const url = `${saksbehandlingApiBaseUrl}/api/behandling/${referanse}/forbered`;
  logInfo('Forbereder behandling ' + referanse);
  return await fetchProxy(url, saksbehandlingApiScope, 'GET').then(() => ventTilProsesseringErFerdig(referanse));
};

export const hentAlleDialogmeldingerPåSak = async (saksnummer: string): Promise<LegeerklæringStatus[]> => {
  const url = `${saksbehandlingApiBaseUrl}/api/dokumentinnhenting/syfo/status/${saksnummer}`;
  return await fetchProxy(url, saksbehandlingApiScope, 'GET');
};

export const bestillDialogmelding = async (requestBody: BestillLegeerklæring) => {
  const url = `${saksbehandlingApiBaseUrl}/api/dokumentinnhenting/syfo/bestill`;
  return await fetchProxy(url, saksbehandlingApiScope, 'POST', requestBody);
};

export const forhåndsvisDialogmelding = async (
  requestBody: ForhåndsvisDialogmelding
): Promise<ForhåndsvisDialogmeldingResponse> => {
  const url = `${saksbehandlingApiBaseUrl}/api/dokumentinnhenting/syfo/brevpreview`;
  return await fetchProxy(url, saksbehandlingApiScope, 'POST', requestBody);
};

export const purrPåLegeerklæring = async (dialogmeldingUUID: string): Promise<void> => {
  const url = `${saksbehandlingApiBaseUrl}/api/dokumentinnhenting/syfo/purring/${dialogmeldingUUID}`;
  return await fetchProxy(url, saksbehandlingApiScope, 'POST');
};

export const hentUnderveisGrunnlag = async (behandlingsreferanse: string): Promise<UnderveisGrunnlag[]> => {
  const url = `${saksbehandlingApiBaseUrl}/api/behandling/underveis/${behandlingsreferanse}`;
  return await fetchProxy(url, saksbehandlingApiScope, 'GET');
};

export const hentAktivitetspliktGrunnlag = async (behandlingsreferanse: string): Promise<AktivitetspliktGrunnlag> => {
  const url = `${saksbehandlingApiBaseUrl}/api/behandling/${behandlingsreferanse}/aktivitetsplikt/effektuer`;
  return await fetchProxy(url, saksbehandlingApiScope, 'GET');
};

export const hentForutgåendeMedlemskapsVurdering = async (
  behandlingsReferanse: string
): Promise<AutomatiskLovvalgOgMedlemskapVurdering> => {
  const url = `${saksbehandlingApiBaseUrl}/api/lovvalgmedlemskap/forutgaaendevurdering/${behandlingsReferanse}`;
  return await fetchProxy(url, saksbehandlingApiScope, 'GET');
};

export const hentAutomatiskLovvalgOgMedlemskapVurdering = async (
  behandlingsReferanse: string
): Promise<AutomatiskLovvalgOgMedlemskapVurdering> => {
  const url = `${saksbehandlingApiBaseUrl}/api/lovvalgmedlemskap/vurdering/${behandlingsReferanse}`;
  return await fetchProxy(url, saksbehandlingApiScope, 'GET');
};

export const sendLokalHendelse = async (body: Object): Promise<void> => {
  const url = `${saksbehandlingApiBaseUrl}/api/hendelse/send`;
  return await fetchProxy(url, saksbehandlingApiScope, 'POST', body);
};

export const auditlog = async (behandlingsreferanse: string) => {
  const url = `${saksbehandlingApiBaseUrl}/api/behandling/${behandlingsreferanse}/auditlog`;
  return await fetchProxy(url, saksbehandlingApiScope, 'POST');
};

export const hentLocalToken = async () => {
  // Må hente headers for å tvinge dynamic route ved lokal utvikling
  // TODO: Revurder i next 15
  await headers();

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

async function ventTilProsesseringErFerdig(
  behandlingsreferanse: string,
  maksAntallForsøk: number = 10,
  interval: number = 1000
): Promise<undefined | FlytProsessering> {
  let forsøk = 0;
  let prosessering: FlytProsessering | undefined = undefined;

  while (forsøk < maksAntallForsøk) {
    forsøk++;

    console.log('Forsøk nummer: ' + forsøk);
    const response = await hentFlyt(behandlingsreferanse);

    const status = response.prosessering.status;

    if (status === 'FERDIG') {
      prosessering = undefined;
      break;
    }

    if (status === 'FEILET') {
      logError('Prosessering feilet pga' + JSON.stringify(response.prosessering.ventendeOppgaver));
      prosessering = response.prosessering;
      break;
    }

    if (forsøk < maksAntallForsøk) {
      await new Promise((resolve) => setTimeout(resolve, interval * 1.3));
    }
  }

  return prosessering;
}
