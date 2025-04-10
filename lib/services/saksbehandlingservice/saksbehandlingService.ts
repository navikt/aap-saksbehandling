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
  OppdaterAktivitetspliktBrudd2,
  OpprettAktivitetspliktBrudd,
  OpprettTestcase,
  RefusjonskravGrunnlag,
  SakPersoninfo,
  SaksInfo,
  SamordningAndreStatligeYtelserGrunnlag,
  SamordningGraderingGrunnlag,
  SamordningUføreGrunnlag,
  SettPåVent,
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
import { apiFetch } from 'lib/services/apiFetch';
import { logError, logInfo } from 'lib/serverutlis/logger';
import { isError, isSuccess } from 'lib/utils/api';

const saksbehandlingApiBaseUrl = process.env.BEHANDLING_API_BASE_URL;
const saksbehandlingApiScope = process.env.BEHANDLING_API_SCOPE ?? '';

export const hentBehandling = async (behandlingsReferanse: string) => {
  const url = `${saksbehandlingApiBaseUrl}/api/behandling/${behandlingsReferanse}`;
  return await apiFetch<DetaljertBehandling>(url, saksbehandlingApiScope, 'GET');
};

export const hentSak = async (saksnummer: string) => {
  const url = `${saksbehandlingApiBaseUrl}/api/sak/${saksnummer}`;
  const res = await apiFetch<SaksInfo>(url, saksbehandlingApiScope, 'GET');

  if (isError(res)) {
    throw new Error('Kunne ikke hente påkrevd sak.');
  } else {
    return res.data;
  }
};

export const hentSakPersoninfo = async (saksnummer: string): Promise<SakPersoninfo> => {
  const url = `${saksbehandlingApiBaseUrl}/api/sak/${saksnummer}/personinformasjon`;
  const res = await apiFetch<SakPersoninfo>(url, saksbehandlingApiScope, 'GET');

  if (isSuccess(res)) {
    return res.data;
  } else {
    return { fnr: 'Ukjent', navn: 'Ukjent' };
  }
};

export const hentBehandlingPersoninfo = async (behandlingsreferanse: string) => {
  const url = `${saksbehandlingApiBaseUrl}/api/behandling/${behandlingsreferanse}/personinformasjon`;
  return await apiFetch<BehandlingPersoninfo>(url, saksbehandlingApiScope, 'GET');
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

export const hentAlleDokumenterPåSak = async (saksnummer: string) => {
  const url = `${saksbehandlingApiBaseUrl}/api/sak/${saksnummer}/dokumenter`;
  return await apiFetch<DokumentInfo[]>(url, saksbehandlingApiScope, 'GET');
};

export const hentLesetilgang = async (saksnummer: string) => {
  const url = `${saksbehandlingApiBaseUrl}/api/sak/${saksnummer}/lesetilgang`;
  return await fetchProxy(url, saksbehandlingApiScope, 'GET');
};

export const hentDokument = async (journalPostId: string, dokumentInfoId: string) => {
  const url = `${saksbehandlingApiBaseUrl}/api/sak/dokument/${journalPostId}/${dokumentInfoId}`;
  return await fetchPdf(url, saksbehandlingApiScope);
};

export const hentYrkesskadeVurderingGrunnlag = async (behandlingsReferanse: string) => {
  const url = `${saksbehandlingApiBaseUrl}/api/behandling/${behandlingsReferanse}/grunnlag/sykdom/yrkesskade`;
  return await apiFetch<YrkesskadeVurderingGrunnlag>(url, saksbehandlingApiScope, 'GET');
};

export const hentStudentGrunnlag = async (behandlingsReferanse: string) => {
  const url = `${saksbehandlingApiBaseUrl}/api/behandling/${behandlingsReferanse}/grunnlag/student`;
  return await apiFetch<StudentGrunnlag>(url, saksbehandlingApiScope, 'GET');
};

export const hentSykdomsGrunnlag = async (behandlingsReferanse: string) => {
  const url = `${saksbehandlingApiBaseUrl}/api/behandling/${behandlingsReferanse}/grunnlag/sykdom/sykdom`;
  return await apiFetch<SykdomsGrunnlag>(url, saksbehandlingApiScope, 'GET');
};

export const hentBarnetilleggGrunnlag = async (behandlingsreferanse: string) => {
  const url = `${saksbehandlingApiBaseUrl}/api/barnetillegg/grunnlag/${behandlingsreferanse}`;
  return await apiFetch<BarnetilleggGrunnlag>(url, saksbehandlingApiScope, 'GET');
};

export const hentKvalitetssikringGrunnlag = async (behandlingsReferanse: string) => {
  const url = `${saksbehandlingApiBaseUrl}/api/behandling/${behandlingsReferanse}/grunnlag/kvalitetssikring`;
  return await apiFetch<KvalitetssikringGrunnlag>(url, saksbehandlingApiScope, 'GET');
};

export const hentSykepengerErstatningGrunnlag = async (behandlingsReferanse: string) => {
  const url = `${saksbehandlingApiBaseUrl}/api/behandling/${behandlingsReferanse}/grunnlag/sykdom/sykepengergrunnlag`;
  return await apiFetch<SykepengeerstatningGrunnlag>(url, saksbehandlingApiScope, 'GET');
};

export const hentAlderGrunnlag = async (behandlingsReferanse: string) => {
  const url = `${saksbehandlingApiBaseUrl}/api/behandling/${behandlingsReferanse}/grunnlag/alder`;
  return await apiFetch<AlderGrunnlag>(url, saksbehandlingApiScope, 'GET');
};
export const hentUnntakMeldepliktGrunnlag = async (behandlingsReferanse: string) => {
  const url = `${saksbehandlingApiBaseUrl}/api/behandling/${behandlingsReferanse}/grunnlag/fritak-meldeplikt`;
  return await apiFetch<FritakMeldepliktGrunnlag>(url, saksbehandlingApiScope, 'GET');
};

export const hentFastsettArbeidsevneGrunnlag = async (behandlingsReferanse: string) => {
  const url = `${saksbehandlingApiBaseUrl}/api/behandling/${behandlingsReferanse}/grunnlag/arbeidsevne`;
  return await apiFetch<ArbeidsevneGrunnlag>(url, saksbehandlingApiScope, 'GET');
};

export const hentBistandsbehovGrunnlag = async (behandlingsReferanse: string) => {
  const url = `${saksbehandlingApiBaseUrl}/api/behandling/${behandlingsReferanse}/grunnlag/bistand`;
  return await apiFetch<BistandsGrunnlag>(url, saksbehandlingApiScope, 'GET');
};

export const hentFatteVedtakGrunnlang = async (behandlingsReferanse: string) => {
  const url = `${saksbehandlingApiBaseUrl}/api/behandling/${behandlingsReferanse}/grunnlag/fatte-vedtak`;
  return await apiFetch<FatteVedtakGrunnlag>(url, saksbehandlingApiScope, 'GET');
};

export const hentBrevGrunnlag = async (behandlingsReferanse: string) => {
  const url = `${saksbehandlingApiBaseUrl}/api/behandling/${behandlingsReferanse}/grunnlag/brev`;
  return await apiFetch<BrevGrunnlag>(url, saksbehandlingApiScope, 'GET');
};

export const hentLovvalgMedlemskapGrunnlag = async (behandlingsReferanse: string) => {
  const url = `${saksbehandlingApiBaseUrl}/api/behandling/${behandlingsReferanse}/grunnlag/lovvalgmedlemskap`;
  return await apiFetch<LovvalgMedlemskapGrunnlag>(url, saksbehandlingApiScope, 'GET');
};

export const hentForutgåendeMedlemskapGrunnlag = async (behandlingsReferanse: string) => {
  const url = `${saksbehandlingApiBaseUrl}/api/behandling/${behandlingsReferanse}/grunnlag/forutgaaendemedlemskap`;
  return await apiFetch<ForutgåendeMedlemskapGrunnlag>(url, saksbehandlingApiScope, 'GET');
};

export const hentSamordningGraderingGrunnlag = async (behandlingsReferanse: string) => {
  const url = `${saksbehandlingApiBaseUrl}/api/behandling/${behandlingsReferanse}/grunnlag/samordning`;
  return await apiFetch<SamordningGraderingGrunnlag>(url, saksbehandlingApiScope, 'GET');
};

export const hentSamordningUføreGrunnlag = async (behandlingsReferanse: string) => {
  const url = `${saksbehandlingApiBaseUrl}/api/behandling/${behandlingsReferanse}/grunnlag/samordning-ufore`;
  return await apiFetch<SamordningUføreGrunnlag>(url, saksbehandlingApiScope, 'GET');
};

export const hentSamordningAndreStatligeYtelseGrunnlag = async (behandlingsReferanse: string) => {
  const url = `${saksbehandlingApiBaseUrl}/api/behandling/${behandlingsReferanse}/grunnlag/samordning-andre-statlige-ytelser`;
  return await apiFetch<SamordningAndreStatligeYtelserGrunnlag>(url, saksbehandlingApiScope, 'GET');
};

export const hentBeregningstidspunktVurdering = async (behandlingsReferanse: string) => {
  const url = `${saksbehandlingApiBaseUrl}/api/behandling/${behandlingsReferanse}/grunnlag/beregning/tidspunkt`;
  return await apiFetch<BeregningTidspunktGrunnlag>(url, saksbehandlingApiScope, 'GET');
};

export const hentBeregningYrkesskadeVurdering = async (behandlingsReferanse: string) => {
  const url = `${saksbehandlingApiBaseUrl}/api/behandling/${behandlingsReferanse}/grunnlag/beregning/yrkesskade`;
  return await apiFetch<YrkeskadeBeregningGrunnlag>(url, saksbehandlingApiScope, 'GET');
};

export const hentHelseInstitusjonsVurdering = async (behandlingsReferanse: string) => {
  const url = `${saksbehandlingApiBaseUrl}/api/behandling/${behandlingsReferanse}/grunnlag/institusjon/helse`;
  return apiFetch<HelseinstitusjonGrunnlag>(url, saksbehandlingApiScope, 'GET');
};

export const hentSoningsvurdering = async (behandlingsreferanse: string): Promise<Soningsgrunnlag> => {
  const url = `${saksbehandlingApiBaseUrl}/api/behandling/${behandlingsreferanse}/grunnlag/institusjon/soning`;
  return fetchProxy<Soningsgrunnlag>(url, saksbehandlingApiScope, 'GET');
};

export const hentTilkjentYtelse = async (behandlingsReferanse: string) => {
  const url = `${saksbehandlingApiBaseUrl}/api/behandling/tilkjent/${behandlingsReferanse}`;
  return await apiFetch<TilkjentYtelseGrunnlag>(url, saksbehandlingApiScope, 'GET');
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
  return await apiFetch<BeregningsGrunnlag>(url, saksbehandlingApiScope, 'GET');
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
  logInfo('Forbereder behandling ' + referanse + 'hihihi');
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

export const purrPåLegeerklæring = async (requestBody: {
  dialogmeldingPurringUUID: string;
  saksnummer: string;
}): Promise<void> => {
  const url = `${saksbehandlingApiBaseUrl}/api/dokumentinnhenting/syfo/purring`;
  return await fetchProxy(url, saksbehandlingApiScope, 'POST', requestBody);
};

export const hentUnderveisGrunnlag = async (behandlingsreferanse: string) => {
  const url = `${saksbehandlingApiBaseUrl}/api/behandling/underveis/${behandlingsreferanse}`;
  return await apiFetch<UnderveisGrunnlag[]>(url, saksbehandlingApiScope, 'GET');
};

export const hentAktivitetspliktGrunnlag = async (behandlingsreferanse: string) => {
  const url = `${saksbehandlingApiBaseUrl}/api/behandling/${behandlingsreferanse}/aktivitetsplikt/effektuer`;
  return await apiFetch<AktivitetspliktGrunnlag>(url, saksbehandlingApiScope, 'GET');
};

export const hentForutgåendeMedlemskapsVurdering = async (behandlingsReferanse: string) => {
  const url = `${saksbehandlingApiBaseUrl}/api/lovvalgmedlemskap/forutgaaendevurdering/${behandlingsReferanse}`;
  return await apiFetch<AutomatiskLovvalgOgMedlemskapVurdering>(url, saksbehandlingApiScope, 'GET');
};

export const hentAutomatiskLovvalgOgMedlemskapVurdering = async (behandlingsReferanse: string) => {
  const url = `${saksbehandlingApiBaseUrl}/api/lovvalgmedlemskap/vurdering/${behandlingsReferanse}`;
  return await apiFetch<AutomatiskLovvalgOgMedlemskapVurdering>(url, saksbehandlingApiScope, 'GET');
};

export const hentRefusjonGrunnlag = async (behandlingsReferanse: string) => {
  const url = `${saksbehandlingApiBaseUrl}/api/behandling/${behandlingsReferanse}/grunnlag/refusjon`;
  return await apiFetch<RefusjonskravGrunnlag>(url, saksbehandlingApiScope, 'GET');
};

export const hentForhåndsvisningBrev = async (brevbestillingReferanse: string): Promise<Blob | undefined> => {
  return fetchPdf(
    `${saksbehandlingApiBaseUrl}/api/brev/${brevbestillingReferanse}/forhandsvis`,
    saksbehandlingApiScope
  );
};

export const sendLokalHendelse = async (saksnummer: string, body: Object): Promise<void> => {
  const url = `${saksbehandlingApiBaseUrl}/api/hendelse/sak/${saksnummer}/send`;
  return await fetchProxy(url, saksbehandlingApiScope, 'POST', body);
};

export const auditlog = async (behandlingsreferanse: string) => {
  const url = `${saksbehandlingApiBaseUrl}/api/behandling/${behandlingsreferanse}/auditlog`;
  return await fetchProxy(url, saksbehandlingApiScope, 'POST');
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
