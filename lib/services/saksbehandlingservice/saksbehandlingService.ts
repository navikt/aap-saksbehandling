import {
  Aktivitetsplikt11_7Grunnlag,
  AlderGrunnlag,
  ArbeidsevneGrunnlag,
  AutomatiskLovvalgOgMedlemskapVurdering,
  AvklarOppfolgingsoppgaveGrunnlagResponse,
  BarnetilleggGrunnlag,
  BehandlendeEnhetGrunnlag,
  BehandlingFlytOgTilstand,
  BehandlingPersoninfo,
  BehandlingsHistorikk,
  BeregningsGrunnlag,
  BeregningTidspunktGrunnlag,
  BestillLegeerklæring,
  BistandsGrunnlag,
  Brev,
  BrevGrunnlag,
  DetaljertBehandling,
  FatteVedtakGrunnlag,
  FlytProsessering,
  ForeslåVedtakGrunnlag,
  ForhåndsvisDialogmelding,
  ForhåndsvisDialogmeldingResponse,
  FormkravGrunnlag,
  ForutgåendeMedlemskapGrunnlag,
  FritakMeldepliktGrunnlag,
  FullmektigGrunnlag,
  HelseinstitusjonGrunnlag,
  KabalKlageResultat,
  KlagebehandlingKontorGrunnlag,
  KlagebehandlingNayGrunnlag,
  Klageresultat,
  KvalitetssikringGrunnlag,
  KvalitetssikringTilgang,
  LegeerklæringStatus,
  LovvalgMedlemskapGrunnlag,
  LøsAvklaringsbehovPåBehandling,
  ManuellInntektGrunnlag,
  MellomlagretVurderingRequest,
  MellomlagretVurderingResponse,
  NavEnhetRequest,
  OppfølgningOppgaveOpprinnelseResponse,
  OpprettDummySakDto,
  OpprettTestcase,
  OvergangUforeGrunnlag,
  OvergangArbeidGrunnlag,
  PåklagetBehandlingGrunnlag,
  RefusjonskravGrunnlag,
  RettighetsperiodeGrunnlag,
  OverstyringMeldepliktGrunnlag,
  SakPersoninfo,
  SaksInfo,
  SamordningAndreStatligeYtelserGrunnlag,
  SamordningArbeidsgiverGrunnlag,
  SamordningGraderingGrunnlag,
  SamordningTjenestePensjonGrunnlag,
  SamordningUføreGrunnlag,
  SettPåVent,
  Soningsgrunnlag,
  StudentGrunnlag,
  SvarFraAndreinstansGrunnlag,
  SykdomsGrunnlag,
  SykdomsvurderingBrevGrunnlag,
  SykepengeerstatningGrunnlag,
  TilkjentYtelseGrunnlag,
  TrekkKlageGrunnlag,
  TrukketSøknadGrunnlag,
  KansellertRevurderingGrunnlag,
  UnderveisGrunnlag,
  UtbetalingOgSimuleringGrunnlag,
  VenteInformasjon,
  YrkeskadeBeregningGrunnlag,
  YrkesskadeVurderingGrunnlag,
  SøkPåSakInfo,
} from 'lib/types/types';
import { apiFetch, apiFetchNoMemoization, apiFetchPdf } from 'lib/services/apiFetch';
import { logError, logInfo } from 'lib/serverutlis/logger';
import { FetchResponse, isError, isSuccess } from 'lib/utils/api';
import { Enhet } from 'lib/types/oppgaveTypes';
import { Behovstype } from 'lib/utils/form';
import { isLocal } from 'lib/utils/environment';

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

export const søkPåSak = async (søketekst: string) => {
  const url = `${saksbehandlingApiBaseUrl}/api/sak/sok`;
  return await apiFetch<SøkPåSakInfo[]>(url, saksbehandlingApiScope, 'POST', { søketekst });
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

export const hentSaksHistorikk = async (saksnummer: string) => {
  const url = `${saksbehandlingApiBaseUrl}/api/sak/${saksnummer}/historikk`;
  return await apiFetch<Array<BehandlingsHistorikk>>(url, saksbehandlingApiScope, 'GET');
};

export const hentBehandlingPersoninfo = async (behandlingsreferanse: string) => {
  const url = `${saksbehandlingApiBaseUrl}/api/behandling/${behandlingsreferanse}/personinformasjon`;
  return await apiFetch<BehandlingPersoninfo>(url, saksbehandlingApiScope, 'GET');
};

export const opprettAktivitetspliktBehandling = async (saksnummer: string) => {
  const url = `${saksbehandlingApiBaseUrl}/api/sak/${saksnummer}/opprettAktivitetspliktBehandling`;
  return await apiFetch<{}>(url, saksbehandlingApiScope, 'POST');
};

export const finnSakerForIdent = async (ident: string) => {
  const url = `${saksbehandlingApiBaseUrl}/api/sak/finn`;
  return await apiFetch<SaksInfo[]>(url, saksbehandlingApiScope, 'POST', { ident });
};

export const hentAlleSaker = async () => {
  const url = `${saksbehandlingApiBaseUrl}/api/sak/alle`;
  return await apiFetch<SaksInfo[]>(url, saksbehandlingApiScope, 'GET');
};

export const hentAlleNavEnheter = async (behandlingsReferanse: string, input: NavEnhetRequest) => {
  const url = `${saksbehandlingApiBaseUrl}/api/navenhet/${behandlingsReferanse}/finn`;
  return await apiFetch<Enhet[]>(url, saksbehandlingApiScope, 'POST', input);
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

export const hentKvalitetssikringTilgang = async (behandlingsReferanse: string) => {
  if (isLocal()) {
    const res: FetchResponse<KvalitetssikringTilgang> = {
      type: 'SUCCESS',
      status: 200,
      data: { harTilgangTilÅKvalitetssikre: true },
    };

    return res;
  }
  const url = `${saksbehandlingApiBaseUrl}/api/behandling/${behandlingsReferanse}/kvalitetssikring-tilgang`;
  return await apiFetch<KvalitetssikringTilgang>(url, saksbehandlingApiScope, 'GET');
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

export const hentRimeligGrunnMeldepliktGrunnlag = async (behandlingsReferanse: string) => {
  const url = `${saksbehandlingApiBaseUrl}/api/behandling/${behandlingsReferanse}/grunnlag/meldeplikt-overstyring`;
  return await apiFetch<OverstyringMeldepliktGrunnlag>(url, saksbehandlingApiScope, 'GET');
};

export const hentSykdomsvurderingBrevGrunnlag = async (behandlingsReferanse: string) => {
  const url = `${saksbehandlingApiBaseUrl}/api/behandling/${behandlingsReferanse}/grunnlag/sykdomsvurdering-for-brev`;
  return await apiFetch<SykdomsvurderingBrevGrunnlag>(url, saksbehandlingApiScope, 'GET');
};

export const hentFastsettArbeidsevneGrunnlag = async (behandlingsReferanse: string) => {
  const url = `${saksbehandlingApiBaseUrl}/api/behandling/${behandlingsReferanse}/grunnlag/arbeidsevne`;
  return await apiFetch<ArbeidsevneGrunnlag>(url, saksbehandlingApiScope, 'GET');
};

export const hentBistandsbehovGrunnlag = async (behandlingsReferanse: string) => {
  const url = `${saksbehandlingApiBaseUrl}/api/behandling/${behandlingsReferanse}/grunnlag/bistand`;
  return await apiFetch<BistandsGrunnlag>(url, saksbehandlingApiScope, 'GET');
};

export const hentOvergangUforeGrunnlag = async (behandlingsReferanse: string) => {
  const url = `${saksbehandlingApiBaseUrl}/api/behandling/${behandlingsReferanse}/grunnlag/overgangufore`;
  return await apiFetch<OvergangUforeGrunnlag>(url, saksbehandlingApiScope, 'GET');
};

export const hentOvergangArbeidGrunnlag = async (behandlingsReferanse: string) => {
  const url = `${saksbehandlingApiBaseUrl}/api/behandling/${behandlingsReferanse}/grunnlag/overgangarbeid`;
  return await apiFetch<OvergangArbeidGrunnlag>(url, saksbehandlingApiScope, 'GET');
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

export const hentSamordningTjenestePensjonGrunnlag = async (behandlingsReferanse: string) => {
  const url = `${saksbehandlingApiBaseUrl}/api/behandling/${behandlingsReferanse}/grunnlag/samordning/tjenestepensjon`;
  return await apiFetch<SamordningTjenestePensjonGrunnlag>(url, saksbehandlingApiScope, 'GET');
};

export const hentSamordningAndreStatligeYtelseGrunnlag = async (behandlingsReferanse: string) => {
  const url = `${saksbehandlingApiBaseUrl}/api/behandling/${behandlingsReferanse}/grunnlag/samordning-andre-statlige-ytelser`;
  return await apiFetch<SamordningAndreStatligeYtelserGrunnlag>(url, saksbehandlingApiScope, 'GET');
};

export const hentSamordningArbeidsgiverGrunnlag = async (behandlingsReferanse: string) => {
  const url = `${saksbehandlingApiBaseUrl}/api/behandling/${behandlingsReferanse}/grunnlag/samordning-arbeidsgiver`;
  return await apiFetch<SamordningArbeidsgiverGrunnlag>(url, saksbehandlingApiScope, 'GET');
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

export const hentManuellInntektGrunnlag = async (behandlingsReferanse: string) => {
  const url = `${saksbehandlingApiBaseUrl}/api/behandling/${behandlingsReferanse}/grunnlag/beregning/manuellinntekt`;
  return apiFetch<ManuellInntektGrunnlag>(url, saksbehandlingApiScope, 'GET');
};

export const hentSoningsvurdering = async (behandlingsreferanse: string) => {
  const url = `${saksbehandlingApiBaseUrl}/api/behandling/${behandlingsreferanse}/grunnlag/institusjon/soning`;
  return apiFetch<Soningsgrunnlag>(url, saksbehandlingApiScope, 'GET');
};

export const hentTilkjentYtelse = async (behandlingsReferanse: string) => {
  const url = `${saksbehandlingApiBaseUrl}/api/behandling/tilkjentV2/${behandlingsReferanse}`;
  return await apiFetch<TilkjentYtelseGrunnlag>(url, saksbehandlingApiScope, 'GET');
};

export const hentTrukketSøknad = async (behandlingsreferanse: string) => {
  const url = `${saksbehandlingApiBaseUrl}/api/behandling/${behandlingsreferanse}/grunnlag/trukket-søknad`;
  return await apiFetch<TrukketSøknadGrunnlag>(url, saksbehandlingApiScope, 'GET');
};

export const hentKansellertRevurdering = async (behandlingsreferanse: string) => {
  const url = `${saksbehandlingApiBaseUrl}/api/behandling/${behandlingsreferanse}/grunnlag/kansellert-revurdering`;
  return await apiFetch<KansellertRevurderingGrunnlag>(url, saksbehandlingApiScope, 'GET');
};

export const hentRettighetsperiodeGrunnlag = async (behandlingsreferanse: string) => {
  const url = `${saksbehandlingApiBaseUrl}/api/behandling/${behandlingsreferanse}/grunnlag/rettighetsperiode`;
  return await apiFetch<RettighetsperiodeGrunnlag>(url, saksbehandlingApiScope, 'GET');
};

export const hentFormkravGrunnlag = async (behandlingsReferanse: string) => {
  const url = `${saksbehandlingApiBaseUrl}/api/klage/${behandlingsReferanse}/grunnlag/formkrav`;
  return await apiFetch<FormkravGrunnlag>(url, saksbehandlingApiScope, 'GET');
};

export const hentFullmektigGrunnlag = async (behandlingsReferanse: string) => {
  const url = `${saksbehandlingApiBaseUrl}/api/klage/${behandlingsReferanse}/grunnlag/fullmektig`;
  return await apiFetch<FullmektigGrunnlag>(url, saksbehandlingApiScope, 'GET');
};

export const hentPåklagetBehandlingGrunnlag = async (behandlingsReferanse: string) => {
  const url = `${saksbehandlingApiBaseUrl}/api/klage/${behandlingsReferanse}/grunnlag/påklaget-behandling`;
  return await apiFetch<PåklagetBehandlingGrunnlag>(url, saksbehandlingApiScope, 'GET');
};

export const hentTrekkKlageGrunnlag = async (behandlingsReferanse: string) => {
  const url = `${saksbehandlingApiBaseUrl}/api/klage/${behandlingsReferanse}/grunnlag/trekk-klage`;
  return await apiFetch<TrekkKlageGrunnlag>(url, saksbehandlingApiScope, 'GET');
};

export const hentBehandlendeEnhetGrunnlag = async (behandlingsReferanse: string) => {
  const url = `${saksbehandlingApiBaseUrl}/api/klage/${behandlingsReferanse}/grunnlag/behandlende-enhet`;
  return await apiFetch<BehandlendeEnhetGrunnlag>(url, saksbehandlingApiScope, 'GET');
};

export const hentKlagebehandlingKontorGrunnlag = async (behandlingsReferanse: string) => {
  const url = `${saksbehandlingApiBaseUrl}/api/klage/${behandlingsReferanse}/grunnlag/klagebehandling-kontor`;
  return await apiFetch<KlagebehandlingKontorGrunnlag>(url, saksbehandlingApiScope, 'GET');
};

export const hentKlagebehandlingNayGrunnlag = async (behandlingsReferanse: string) => {
  const url = `${saksbehandlingApiBaseUrl}/api/klage/${behandlingsReferanse}/grunnlag/klagebehandling-nay`;
  return await apiFetch<KlagebehandlingNayGrunnlag>(url, saksbehandlingApiScope, 'GET');
};

export const hentKlageresultat = async (behandlingsReferanse: string) => {
  const url = `${saksbehandlingApiBaseUrl}/api/klage/${behandlingsReferanse}/resultat`;
  return await apiFetch<Klageresultat>(url, saksbehandlingApiScope, 'GET');
};

export const hentKabalKlageresultat = async (behandlingsReferanse: string) => {
  const url = `${saksbehandlingApiBaseUrl}/api/klage/${behandlingsReferanse}/kabal-resultat`;
  const res = await apiFetch<KabalKlageResultat>(url, saksbehandlingApiScope, 'GET');
  if (isError(res)) {
    logError(`Kunne ikke hente kabal-resultat for behandling ${behandlingsReferanse}`, res.apiException);
    return;
  } else {
    return res.data;
  }
};

export const hentAktivitetsplikt11_7Grunnlag = async (behandlingsreferanse: string) => {
  const url = `${saksbehandlingApiBaseUrl}/api/aktivitetsplikt/${behandlingsreferanse}/grunnlag/brudd-11-7`;
  return await apiFetch<Aktivitetsplikt11_7Grunnlag>(url, saksbehandlingApiScope, 'GET');
};

export const hentSvarFraAndreinstansGrunnlag = async (behandlingsReferanse: string) => {
  const url = `${saksbehandlingApiBaseUrl}/api/svar-fra-andreinstans/${behandlingsReferanse}/grunnlag/svar-fra-andreinstans`;
  return await apiFetch<SvarFraAndreinstansGrunnlag>(url, saksbehandlingApiScope, 'GET');
};

export const hentFlyt = async (behandlingsReferanse: string) => {
  const url = `${saksbehandlingApiBaseUrl}/api/behandling/${behandlingsReferanse}/flyt`;
  return await apiFetch<BehandlingFlytOgTilstand>(url, saksbehandlingApiScope, 'GET', undefined, [
    `flyt/${behandlingsReferanse}`,
  ]);
};

// Requestene skal ikke caches ved polling
export const hentFlytUtenRequestMemoization = async (behandlingsReferanse: string) => {
  const url = `${saksbehandlingApiBaseUrl}/api/behandling/${behandlingsReferanse}/flyt`;
  return await apiFetchNoMemoization<BehandlingFlytOgTilstand>(url, saksbehandlingApiScope, 'GET');
};

export const hentUtbetalingOgSimuleringGrunnlag = async (behandlingsreferanse: string) => {
  const url = `${saksbehandlingApiBaseUrl}/api/behandling/${behandlingsreferanse}/utbetaling/simulering`;
  return await apiFetch<UtbetalingOgSimuleringGrunnlag[]>(url, saksbehandlingApiScope, 'GET', undefined, [
    `utbetalingogsimulering/${behandlingsreferanse}`,
  ]);
};

export const løsAvklaringsbehov = async (avklaringsBehov: LøsAvklaringsbehovPåBehandling) => {
  const url = `${saksbehandlingApiBaseUrl}/api/behandling/løs-behov`;
  return await apiFetch<void>(url, saksbehandlingApiScope, 'POST', avklaringsBehov);
};

export const mellomlagreBrev = async (brevbestillingReferanse: string, brev: Brev) => {
  const url = `${saksbehandlingApiBaseUrl}/api/brev/${brevbestillingReferanse}/oppdater`;
  return await apiFetch<void>(url, saksbehandlingApiScope, 'PUT', brev);
};

export const opprettDummySakDev = async (sak: OpprettTestcase) => {
  const url = `${saksbehandlingApiBaseUrl}/test/opprett`;
  return await apiFetch<void>(url, saksbehandlingApiScope, 'POST', sak);
};

export const opprettDummySakTest = async (sak: OpprettDummySakDto) => {
  const url = `${saksbehandlingApiBaseUrl}/api/test/opprettDummySak`;
  return await apiFetch<void>(url, saksbehandlingApiScope, 'POST', sak);
};

export const bestillTestBrev = async (bestilling: { behandlingReferanse: string }) => {
  const url = `${saksbehandlingApiBaseUrl}/test/brev`;
  return await apiFetch<void>(url, saksbehandlingApiScope, 'POST', bestilling);
};

export const hentBeregningsGrunnlag = async (referanse: string) => {
  const url = `${saksbehandlingApiBaseUrl}/api/beregning/grunnlag/${referanse}`;
  return await apiFetch<BeregningsGrunnlag>(url, saksbehandlingApiScope, 'GET');
};

export const settBehandlingPåVent = async (referanse: string, requestBody: SettPåVent) => {
  const url = `${saksbehandlingApiBaseUrl}/api/behandling/${referanse}/sett-på-vent`;
  return await apiFetch(url, saksbehandlingApiScope, 'POST', requestBody);
};

export const hentBehandlingPåVentInformasjon = async (referanse: string) => {
  const url = `${saksbehandlingApiBaseUrl}/api/behandling/${referanse}/vente-informasjon`;
  return await apiFetch<VenteInformasjon>(url, saksbehandlingApiScope, 'GET');
};

export const forberedBehandlingOgVentPåProsessering = async (
  referanse: string
): Promise<undefined | FlytProsessering> => {
  const url = `${saksbehandlingApiBaseUrl}/api/behandling/${referanse}/forbered`;
  logInfo('Forbereder behandling ' + referanse);
  return await apiFetch(url, saksbehandlingApiScope, 'GET').then(() => ventTilProsesseringErFerdig(referanse));
};

export const hentAlleDialogmeldingerPåSak = async (saksnummer: string) => {
  const url = `${saksbehandlingApiBaseUrl}/api/dokumentinnhenting/syfo/status/${saksnummer}`;
  return await apiFetch<LegeerklæringStatus[]>(url, saksbehandlingApiScope, 'GET');
};

export const bestillDialogmelding = async (requestBody: BestillLegeerklæring) => {
  const url = `${saksbehandlingApiBaseUrl}/api/dokumentinnhenting/syfo/bestill`;
  return await apiFetch(url, saksbehandlingApiScope, 'POST', requestBody);
};

export const forhåndsvisDialogmelding = async (requestBody: ForhåndsvisDialogmelding) => {
  const url = `${saksbehandlingApiBaseUrl}/api/dokumentinnhenting/syfo/brevpreview`;
  return await apiFetch<ForhåndsvisDialogmeldingResponse>(url, saksbehandlingApiScope, 'POST', requestBody);
};

export const purrPåLegeerklæring = async (requestBody: { dialogmeldingPurringUUID: string; saksnummer: string }) => {
  const url = `${saksbehandlingApiBaseUrl}/api/dokumentinnhenting/syfo/purring`;
  return await apiFetch<void>(url, saksbehandlingApiScope, 'POST', requestBody);
};

export const hentUnderveisGrunnlag = async (behandlingsreferanse: string) => {
  const url = `${saksbehandlingApiBaseUrl}/api/behandling/underveis/${behandlingsreferanse}`;
  return await apiFetch<UnderveisGrunnlag[]>(url, saksbehandlingApiScope, 'GET');
};

export const hentForeslåVedtakGrunnlag = async (behandlingsreferanse: string) => {
  const url = `${saksbehandlingApiBaseUrl}/api/behandling/${behandlingsreferanse}/grunnlag/foreslaa-vedtak`;
  return await apiFetch<ForeslåVedtakGrunnlag>(url, saksbehandlingApiScope, 'GET');
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
  return apiFetchPdf(
    `${saksbehandlingApiBaseUrl}/api/brev/${brevbestillingReferanse}/forhandsvis`,
    saksbehandlingApiScope
  );
};

export const hentOppfølgingsoppgaveGrunnlag = async (behandlingsReferanse: string) => {
  return apiFetch<AvklarOppfolgingsoppgaveGrunnlagResponse>(
    `${saksbehandlingApiBaseUrl}/api/behandling/${behandlingsReferanse}/grunnlag/oppfolgingsoppgave`,
    saksbehandlingApiScope
  );
};

export const hentMellomlagring = async (behandlingsReferanse: string, kode: string) => {
  const res = await apiFetch<MellomlagretVurderingResponse>(
    `${saksbehandlingApiBaseUrl}/api/behandling/mellomlagret-vurdering/${behandlingsReferanse}/${kode}`,
    saksbehandlingApiScope
  );

  if (isSuccess(res)) {
    if (res.data.mellomlagretVurdering !== null) {
      return res.data.mellomlagretVurdering;
    }

    return undefined;
  }
};

export const hentOppfølgningsOppgaverOpprinselsePåBehandlingsReferanse = async (
  behandlingsReferanse: string,
  kode: string
) => {
  return apiFetch<OppfølgningOppgaveOpprinnelseResponse>(
    `${saksbehandlingApiBaseUrl}/api/behandling/oppfølgningOppgaveOpprinnelse/${behandlingsReferanse}/${kode}`,
    saksbehandlingApiScope
  );
};

export const lagreMellomlagring = async (request: MellomlagretVurderingRequest) => {
  return apiFetch<MellomlagretVurderingResponse>(
    `${saksbehandlingApiBaseUrl}/api/behandling/mellomlagret-vurdering`,
    saksbehandlingApiScope,
    'POST',
    request
  );
};

export const slettMellomlagring = async (behandlingsReferanse: string, kode: Behovstype) => {
  return apiFetch(
    `${saksbehandlingApiBaseUrl}/api/behandling/mellomlagret-vurdering/${behandlingsReferanse}/${kode}/slett`,
    saksbehandlingApiScope,
    'POST'
  );
};

export const sendLokalHendelse = async (saksnummer: string, body: Object) => {
  const url = `${saksbehandlingApiBaseUrl}/api/hendelse/sak/${saksnummer}/send`;
  return await apiFetch(url, saksbehandlingApiScope, 'POST', body);
};

export const auditlog = async (behandlingsreferanse: string) => {
  const url = `${saksbehandlingApiBaseUrl}/api/behandling/${behandlingsreferanse}/auditlog`;
  return await apiFetch(url, saksbehandlingApiScope, 'POST');
};

async function ventTilProsesseringErFerdig(
  behandlingsreferanse: string,
  maksAntallForsøk: number = 15,
  interval: number = 1000
): Promise<undefined | FlytProsessering> {
  let forsøk = 0;
  let prosessering: FlytProsessering | undefined = undefined;

  while (forsøk < maksAntallForsøk) {
    forsøk++;

    const response = await hentFlytUtenRequestMemoization(behandlingsreferanse);
    if (response.type === 'ERROR') {
      logError(
        `ventTilProssesering hentFlyt ${response.status} - ${response.apiException.code}: ${response.apiException.message}`
      );
      prosessering = { status: 'FEILET', ventendeOppgaver: [] };
      break;
    }

    const status = response.data.prosessering.status;

    if (status === 'FERDIG') {
      logInfo(`Prosessering er ferdig! Brukte ${forsøk} forsøk.`);
      prosessering = response.data.prosessering;
      break;
    }

    if (status === 'FEILET') {
      logError('Prosessering av flyt feilet!', Error(JSON.stringify(response.data.prosessering.ventendeOppgaver)));
      prosessering = response.data.prosessering;
      break;
    }

    if (status === 'JOBBER') {
      prosessering = response.data.prosessering;
    }

    if (forsøk < maksAntallForsøk) {
      await new Promise((resolve) => setTimeout(resolve, interval * 1.3));
    }
  }

  if (prosessering?.status === 'JOBBER') {
    logInfo(`Brukte ${forsøk} forsøk og endte i status ${prosessering.status}`);
  }

  return prosessering;
}
