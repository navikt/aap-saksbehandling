import 'server-only';

import {
  Aktivitetsplikt11_7Grunnlag,
  Aktivitetsplikt11_9Grunnlag,
  AktivitetspliktMedTrekkRespons,
  AlderGrunnlag,
  ArbeidsevneGrunnlag,
  ArbeidsopptrappingGrunnlagResponse,
  AutomatiskLovvalgOgMedlemskapVurdering,
  AvbrytRevurderingGrunnlag,
  AvklarOppfolgingsoppgaveGrunnlagResponse,
  BarnepensjonGrunnlag,
  BarnetilleggGrunnlag,
  BehandlendeEnhetGrunnlag,
  BehandlingFlytOgTilstand,
  BehandlingPersoninfo,
  BehandlingsHistorikk,
  BekreftVurderingerOppfølgingGrunnlag,
  BeregningsGrunnlag,
  BeregningTidspunktGrunnlag,
  BestillLegeerklæring,
  BistandsGrunnlag,
  Brev,
  BrevdataDto,
  BrevGrunnlag,
  DetaljertBehandling,
  EtableringEgenVirksomhetGrunnlagResponse,
  FatteVedtakGrunnlag,
  FlytProsessering,
  ForeløpigBehandlingsutfall,
  ForeslåVedtakGrunnlag,
  ForeslåVedtakVedtakslengdeGrunnlag,
  ForhåndsvisDialogmelding,
  ForhåndsvisDialogmeldingResponse,
  FormkravGrunnlag,
  FritakMeldepliktGrunnlag,
  FullmektigGrunnlag,
  HelseinstitusjonGrunnlag,
  InntektsbortfallResponse,
  KabalKlageResultat,
  KanDistribuereBrevRequest,
  KanDistribuereBrevResponse,
  KlagebehandlingKontorGrunnlag,
  KlagebehandlingNayGrunnlag,
  Klageresultat,
  KvalitetssikringGrunnlag,
  KvalitetssikringTilgang,
  LegeerklæringStatus,
  LøsAvklaringsbehovPåBehandling,
  LøsPeriodisertBehovPåBehandling,
  ManuellInntektGrunnlag,
  MellomlagretVurderingRequest,
  MellomlagretVurderingResponse,
  NavEnhetRequest,
  OppfølgningOppgaveOpprinnelseResponse,
  OppholdskravGrunnlagResponse,
  OpprettAktivitetspliktBehandlingDto,
  OpprettDummySakDto,
  OpprettTestcase,
  OvergangArbeidGrunnlag,
  OvergangUforeGrunnlag,
  OverstyringMeldepliktGrunnlag,
  PeriodisertForutgåendeMedlemskapGrunnlag,
  PeriodisertLovvalgMedlemskapGrunnlag,
  PåklagetBehandlingGrunnlag,
  RefusjonskravGrunnlag,
  RettighetsinfoDto,
  RettighetsperiodeGrunnlag,
  SakPersoninfo,
  SaksInfo,
  SamordningAndreStatligeYtelserGrunnlag,
  SamordningArbeidsgiverGrunnlag,
  SamordningGraderingGrunnlag,
  SamordningTjenestePensjonGrunnlag,
  SamordningUføreGrunnlag,
  SettPåVent,
  Soningsgrunnlag,
  StegType,
  StudentGrunnlag,
  SvarFraAndreinstansGrunnlag,
  SykdomsGrunnlag,
  SykdomsvurderingBrevGrunnlag,
  SykepengeerstatningGrunnlag,
  SykestipendGrunnlag,
  SøkPåSakInfo,
  TilkjentYtelseGrunnlag,
  TrekkKlageGrunnlag,
  TrukketSøknadGrunnlag,
  UnderveisGrunnlag,
  UtbetalingOgSimuleringGrunnlag,
  VedtakslengdeGrunnlag,
  VenteInformasjon,
  YrkeskadeBeregningGrunnlag,
  YrkesskadeVurderingGrunnlag,
} from 'lib/types/types';
import { apiFetch, apiFetchNoMemoization, apiFetchPdf } from 'lib/services/apiFetch';
import { logError, logInfo, logWarning } from 'lib/serverutlis/logger';
import { FetchResponse, isError, isSuccess } from 'lib/utils/api';
import { Enhet } from 'lib/types/oppgaveTypes';
import { Behovstype } from 'lib/utils/form';
import { isLocal } from 'lib/utils/environment';
import { notFound } from 'next/navigation';
import { ingenTilgang } from 'lib/utils/ingenTilgang';

const saksbehandlingApiBaseUrl = process.env.BEHANDLING_API_BASE_URL;
const saksbehandlingApiScope = process.env.BEHANDLING_API_SCOPE ?? '';

export const hentBehandling = async (behandlingsreferanse: string) => {
  const url = `${saksbehandlingApiBaseUrl}/api/behandling/${behandlingsreferanse}`;
  return await apiFetch<DetaljertBehandling>(url, saksbehandlingApiScope, 'GET');
};

export const hentSak = async (saksnummer: string) => {
  const url = `${saksbehandlingApiBaseUrl}/api/sak/${saksnummer}`;
  const res = await apiFetch<SaksInfo>(url, saksbehandlingApiScope, 'GET');

  if (isError(res)) {
    if (res.status === 403) {
      ingenTilgang();
    } else if (res.status === 404) {
      notFound();
    } else {
      logError(`Feil ved henting av sak ${saksnummer}`, res.apiException);
      throw new Error(res.apiException.message || 'Ukjent feil oppsto ved henting av sak');
    }
  }
  return res.data;
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

export const opprettAktivitetspliktBehandling = async (
  saksnummer: string,
  data: OpprettAktivitetspliktBehandlingDto
) => {
  const url = `${saksbehandlingApiBaseUrl}/api/sak/${saksnummer}/opprettAktivitetspliktBehandling`;
  return await apiFetch<{}>(url, saksbehandlingApiScope, 'POST', data);
};

export const finnSakerForIdent = async (ident: string) => {
  const url = `${saksbehandlingApiBaseUrl}/api/sak/finn`;
  return await apiFetch<SaksInfo[]>(url, saksbehandlingApiScope, 'POST', { ident });
};

export const hentSiste = async (antall: number) => {
  const url = `${saksbehandlingApiBaseUrl}/api/sak/siste/${antall}`;
  return await apiFetch<SaksInfo[]>(url, saksbehandlingApiScope, 'GET');
};

export const hentAlleNavEnheter = async (behandlingsreferanse: string, input: NavEnhetRequest) => {
  const url = `${saksbehandlingApiBaseUrl}/api/navenhet/${behandlingsreferanse}/finn`;
  return await apiFetch<Enhet[]>(url, saksbehandlingApiScope, 'POST', input);
};

export const hentYrkesskadeVurderingGrunnlag = async (behandlingsreferanse: string) => {
  const url = `${saksbehandlingApiBaseUrl}/api/behandling/${behandlingsreferanse}/grunnlag/sykdom/yrkesskade`;
  return await apiFetch<YrkesskadeVurderingGrunnlag>(url, saksbehandlingApiScope, 'GET');
};

export const hentStudentGrunnlag = async (behandlingsreferanse: string) => {
  const url = `${saksbehandlingApiBaseUrl}/api/behandling/${behandlingsreferanse}/grunnlag/student`;
  return await apiFetch<StudentGrunnlag>(url, saksbehandlingApiScope, 'GET');
};

export const hentSykestipendGrunnlag = async (behandlingsreferanse: string) => {
  const url = `${saksbehandlingApiBaseUrl}/api/behandling/${behandlingsreferanse}/grunnlag/sykestipend`;
  return await apiFetch<SykestipendGrunnlag>(url, saksbehandlingApiScope, 'GET');
};

export const hentSykdomsGrunnlag = async (behandlingsreferanse: string) => {
  const url = `${saksbehandlingApiBaseUrl}/api/behandling/${behandlingsreferanse}/grunnlag/sykdom/sykdom`;
  return await apiFetch<SykdomsGrunnlag>(url, saksbehandlingApiScope, 'GET');
};

export const hentBarnetilleggGrunnlag = async (behandlingsreferanse: string) => {
  const url = `${saksbehandlingApiBaseUrl}/api/barnetillegg/grunnlag/${behandlingsreferanse}`;
  return await apiFetch<BarnetilleggGrunnlag>(url, saksbehandlingApiScope, 'GET');
};

export const hentKvalitetssikringGrunnlag = async (behandlingsreferanse: string) => {
  const url = `${saksbehandlingApiBaseUrl}/api/behandling/${behandlingsreferanse}/grunnlag/kvalitetssikring`;
  return await apiFetch<KvalitetssikringGrunnlag>(url, saksbehandlingApiScope, 'GET');
};

const lokalFakeKvalitetssikrerTilgang = isLocal();
export const hentKvalitetssikringTilgang = async (behandlingsreferanse: string) => {
  if (lokalFakeKvalitetssikrerTilgang) {
    const res: FetchResponse<KvalitetssikringTilgang> = {
      type: 'SUCCESS',
      status: 200,
      data: { harTilgangTilÅKvalitetssikre: true },
    };

    return res;
  }
  const url = `${saksbehandlingApiBaseUrl}/api/behandling/${behandlingsreferanse}/kvalitetssikring-tilgang`;
  return await apiFetch<KvalitetssikringTilgang>(url, saksbehandlingApiScope, 'GET');
};

export const hentSykepengerErstatningGrunnlag = async (behandlingsreferanse: string) => {
  const url = `${saksbehandlingApiBaseUrl}/api/behandling/${behandlingsreferanse}/grunnlag/sykdom/sykepengergrunnlag`;
  return await apiFetch<SykepengeerstatningGrunnlag>(url, saksbehandlingApiScope, 'GET');
};

export const hentAlderGrunnlag = async (behandlingsreferanse: string) => {
  const url = `${saksbehandlingApiBaseUrl}/api/behandling/${behandlingsreferanse}/grunnlag/alder`;
  return await apiFetch<AlderGrunnlag>(url, saksbehandlingApiScope, 'GET');
};

export const hentBekreftVurderingerOppfølgingGrunnlag = async (behandlingsreferanse: string) => {
  const url = `${saksbehandlingApiBaseUrl}/api/behandling/${behandlingsreferanse}/grunnlag/bekreft-vurderinger-oppfolging`;
  return await apiFetch<BekreftVurderingerOppfølgingGrunnlag>(url, saksbehandlingApiScope, 'GET');
};

export const hentUnntakMeldepliktGrunnlag = async (behandlingsreferanse: string) => {
  const url = `${saksbehandlingApiBaseUrl}/api/behandling/${behandlingsreferanse}/grunnlag/fritak-meldeplikt`;
  return await apiFetch<FritakMeldepliktGrunnlag>(url, saksbehandlingApiScope, 'GET');
};

export const hentRimeligGrunnMeldepliktGrunnlag = async (behandlingsreferanse: string) => {
  const url = `${saksbehandlingApiBaseUrl}/api/behandling/${behandlingsreferanse}/grunnlag/meldeplikt-overstyring`;
  return await apiFetch<OverstyringMeldepliktGrunnlag>(url, saksbehandlingApiScope, 'GET');
};

export const hentOppholdskravGrunnlag = async (behandlingsreferanse: string) => {
  const url = `${saksbehandlingApiBaseUrl}/api/behandling/${behandlingsreferanse}/grunnlag/oppholdskrav`;
  return await apiFetch<OppholdskravGrunnlagResponse>(url, saksbehandlingApiScope, 'GET');
};

export const hentSykdomsvurderingBrevGrunnlag = async (behandlingsreferanse: string) => {
  const url = `${saksbehandlingApiBaseUrl}/api/behandling/${behandlingsreferanse}/grunnlag/sykdomsvurdering-for-brev`;
  return await apiFetch<SykdomsvurderingBrevGrunnlag>(url, saksbehandlingApiScope, 'GET');
};

export const hentFastsettArbeidsevneGrunnlag = async (behandlingsreferanse: string) => {
  const url = `${saksbehandlingApiBaseUrl}/api/behandling/${behandlingsreferanse}/grunnlag/arbeidsevne`;
  return await apiFetch<ArbeidsevneGrunnlag>(url, saksbehandlingApiScope, 'GET');
};

export const hentBistandsbehovGrunnlag = async (behandlingsreferanse: string) => {
  const url = `${saksbehandlingApiBaseUrl}/api/behandling/${behandlingsreferanse}/grunnlag/bistand`;
  return await apiFetch<BistandsGrunnlag>(url, saksbehandlingApiScope, 'GET');
};

export const hentOvergangUforeGrunnlag = async (behandlingsreferanse: string) => {
  const url = `${saksbehandlingApiBaseUrl}/api/behandling/${behandlingsreferanse}/grunnlag/overgangufore`;
  return await apiFetch<OvergangUforeGrunnlag>(url, saksbehandlingApiScope, 'GET');
};

export const hentOvergangArbeidGrunnlag = async (behandlingsreferanse: string) => {
  const url = `${saksbehandlingApiBaseUrl}/api/behandling/${behandlingsreferanse}/grunnlag/overgangarbeid`;
  return await apiFetch<OvergangArbeidGrunnlag>(url, saksbehandlingApiScope, 'GET');
};

export const hentFatteVedtakGrunnlang = async (behandlingsreferanse: string) => {
  const url = `${saksbehandlingApiBaseUrl}/api/behandling/${behandlingsreferanse}/grunnlag/fatte-vedtak`;
  return await apiFetch<FatteVedtakGrunnlag>(url, saksbehandlingApiScope, 'GET');
};

export const hentBrevGrunnlag = async (behandlingsreferanse: string) => {
  const url = `${saksbehandlingApiBaseUrl}/api/behandling/${behandlingsreferanse}/grunnlag/brev`;
  return await apiFetch<BrevGrunnlag>(url, saksbehandlingApiScope, 'GET');
};

export const hentLovvalgMedlemskapGrunnlag = async (behandlingsreferanse: string) => {
  const url = `${saksbehandlingApiBaseUrl}/api/behandling/${behandlingsreferanse}/grunnlag/lovvalgmedlemskap`;
  return await apiFetch<PeriodisertLovvalgMedlemskapGrunnlag>(url, saksbehandlingApiScope, 'GET');
};

export const hentForutgåendeMedlemskapGrunnlag = async (behandlingsreferanse: string) => {
  const url = `${saksbehandlingApiBaseUrl}/api/behandling/${behandlingsreferanse}/grunnlag/forutgaaendemedlemskap`;
  return await apiFetch<PeriodisertForutgåendeMedlemskapGrunnlag>(url, saksbehandlingApiScope, 'GET');
};

export const hentSamordningGraderingGrunnlag = async (behandlingsreferanse: string) => {
  const url = `${saksbehandlingApiBaseUrl}/api/behandling/${behandlingsreferanse}/grunnlag/samordning`;
  return await apiFetch<SamordningGraderingGrunnlag>(url, saksbehandlingApiScope, 'GET');
};

export const hentSamordningUføreGrunnlag = async (behandlingsreferanse: string) => {
  const url = `${saksbehandlingApiBaseUrl}/api/behandling/${behandlingsreferanse}/grunnlag/samordning-ufore`;
  return await apiFetch<SamordningUføreGrunnlag>(url, saksbehandlingApiScope, 'GET');
};

export const hentSamordningTjenestePensjonGrunnlag = async (behandlingsreferanse: string) => {
  const url = `${saksbehandlingApiBaseUrl}/api/behandling/${behandlingsreferanse}/grunnlag/samordning/tjenestepensjon`;
  return await apiFetch<SamordningTjenestePensjonGrunnlag>(url, saksbehandlingApiScope, 'GET');
};

export const hentSamordningAndreStatligeYtelseGrunnlag = async (behandlingsreferanse: string) => {
  const url = `${saksbehandlingApiBaseUrl}/api/behandling/${behandlingsreferanse}/grunnlag/samordning-andre-statlige-ytelser`;
  return await apiFetch<SamordningAndreStatligeYtelserGrunnlag>(url, saksbehandlingApiScope, 'GET');
};

export const hentSamordningArbeidsgiverGrunnlag = async (behandlingsreferanse: string) => {
  const url = `${saksbehandlingApiBaseUrl}/api/behandling/${behandlingsreferanse}/grunnlag/samordning-arbeidsgiver`;
  return await apiFetch<SamordningArbeidsgiverGrunnlag>(url, saksbehandlingApiScope, 'GET');
};

export const hentBeregningstidspunktVurdering = async (behandlingsreferanse: string) => {
  const url = `${saksbehandlingApiBaseUrl}/api/behandling/${behandlingsreferanse}/grunnlag/beregning/tidspunkt`;
  return await apiFetch<BeregningTidspunktGrunnlag>(url, saksbehandlingApiScope, 'GET');
};

export const hentBeregningYrkesskadeVurdering = async (behandlingsreferanse: string) => {
  const url = `${saksbehandlingApiBaseUrl}/api/behandling/${behandlingsreferanse}/grunnlag/beregning/yrkesskade`;
  return await apiFetch<YrkeskadeBeregningGrunnlag>(url, saksbehandlingApiScope, 'GET');
};

export const hentInntektsBortfallGrunnlag = async (behandlingsreferanse: string) => {
  const url = `${saksbehandlingApiBaseUrl}/api/behandling/${behandlingsreferanse}/grunnlag/inntektsbortfall`;
  return await apiFetch<InntektsbortfallResponse>(url, saksbehandlingApiScope, 'GET');
};

export const hentHelseInstitusjonsGrunnlagNy = async (behandlingsreferanse: string) => {
  const url = `${saksbehandlingApiBaseUrl}/api/behandling/${behandlingsreferanse}/grunnlag/institusjon/helse`;
  return apiFetch<HelseinstitusjonGrunnlag>(url, saksbehandlingApiScope, 'GET');
};

export const hentManuellInntektGrunnlag = async (behandlingsreferanse: string) => {
  const url = `${saksbehandlingApiBaseUrl}/api/behandling/${behandlingsreferanse}/grunnlag/beregning/manuellinntekt`;
  return apiFetch<ManuellInntektGrunnlag>(url, saksbehandlingApiScope, 'GET');
};

export const hentSoningsvurdering = async (behandlingsreferanse: string) => {
  const url = `${saksbehandlingApiBaseUrl}/api/behandling/${behandlingsreferanse}/grunnlag/institusjon/soning`;
  return apiFetch<Soningsgrunnlag>(url, saksbehandlingApiScope, 'GET');
};

export const hentTilkjentYtelse = async (behandlingsreferanse: string) => {
  const url = `${saksbehandlingApiBaseUrl}/api/behandling/tilkjentV2/${behandlingsreferanse}`;
  return await apiFetch<TilkjentYtelseGrunnlag>(url, saksbehandlingApiScope, 'GET');
};

export const hentTrukketSøknad = async (behandlingsreferanse: string) => {
  const url = `${saksbehandlingApiBaseUrl}/api/behandling/${behandlingsreferanse}/grunnlag/trukket-søknad`;
  return await apiFetch<TrukketSøknadGrunnlag>(url, saksbehandlingApiScope, 'GET');
};

export const hentAvbruttRevurdering = async (behandlingsreferanse: string) => {
  const url = `${saksbehandlingApiBaseUrl}/api/behandling/${behandlingsreferanse}/grunnlag/avbryt-revurdering`;
  return await apiFetch<AvbrytRevurderingGrunnlag>(url, saksbehandlingApiScope, 'GET');
};

export const hentRettighetsperiodeGrunnlag = async (behandlingsreferanse: string) => {
  const url = `${saksbehandlingApiBaseUrl}/api/behandling/${behandlingsreferanse}/grunnlag/rettighetsperiode`;
  return await apiFetch<RettighetsperiodeGrunnlag>(url, saksbehandlingApiScope, 'GET');
};

export const hentFormkravGrunnlag = async (behandlingsreferanse: string) => {
  const url = `${saksbehandlingApiBaseUrl}/api/klage/${behandlingsreferanse}/grunnlag/formkrav`;
  return await apiFetch<FormkravGrunnlag>(url, saksbehandlingApiScope, 'GET');
};

export const hentFullmektigGrunnlag = async (behandlingsreferanse: string) => {
  const url = `${saksbehandlingApiBaseUrl}/api/klage/${behandlingsreferanse}/grunnlag/fullmektig`;
  return await apiFetch<FullmektigGrunnlag>(url, saksbehandlingApiScope, 'GET');
};

export const hentPåklagetBehandlingGrunnlag = async (behandlingsreferanse: string) => {
  const url = `${saksbehandlingApiBaseUrl}/api/klage/${behandlingsreferanse}/grunnlag/påklaget-behandling`;
  return await apiFetch<PåklagetBehandlingGrunnlag>(url, saksbehandlingApiScope, 'GET');
};

export const hentTrekkKlageGrunnlag = async (behandlingsreferanse: string) => {
  const url = `${saksbehandlingApiBaseUrl}/api/klage/${behandlingsreferanse}/grunnlag/trekk-klage`;
  return await apiFetch<TrekkKlageGrunnlag>(url, saksbehandlingApiScope, 'GET');
};

export const hentBehandlendeEnhetGrunnlag = async (behandlingsreferanse: string) => {
  const url = `${saksbehandlingApiBaseUrl}/api/klage/${behandlingsreferanse}/grunnlag/behandlende-enhet`;
  return await apiFetch<BehandlendeEnhetGrunnlag>(url, saksbehandlingApiScope, 'GET');
};

export const hentKlagebehandlingKontorGrunnlag = async (behandlingsreferanse: string) => {
  const url = `${saksbehandlingApiBaseUrl}/api/klage/${behandlingsreferanse}/grunnlag/klagebehandling-kontor`;
  return await apiFetch<KlagebehandlingKontorGrunnlag>(url, saksbehandlingApiScope, 'GET');
};

export const hentKlagebehandlingNayGrunnlag = async (behandlingsreferanse: string) => {
  const url = `${saksbehandlingApiBaseUrl}/api/klage/${behandlingsreferanse}/grunnlag/klagebehandling-nay`;
  return await apiFetch<KlagebehandlingNayGrunnlag>(url, saksbehandlingApiScope, 'GET');
};

export const hentKlageresultat = async (behandlingsreferanse: string): Promise<FetchResponse<Klageresultat>> => {
  const url = `${saksbehandlingApiBaseUrl}/api/klage/${behandlingsreferanse}/resultat`;
  return await apiFetch<Klageresultat>(url, saksbehandlingApiScope, 'GET');
};

export const hentKabalKlageresultat = async (
  behandlingsreferanse: string
): Promise<FetchResponse<KabalKlageResultat>> => {
  const url = `${saksbehandlingApiBaseUrl}/api/klage/${behandlingsreferanse}/kabal-resultat`;
  const res = await apiFetch<KabalKlageResultat>(url, saksbehandlingApiScope, 'GET');

  if (isError(res)) {
    logWarning(`Kunne ikke hente kabal-resultat for behandling ${behandlingsreferanse}`, res.apiException);
  }

  return res;
};

export const hentAktivitetsplikt11_7Grunnlag = async (behandlingsreferanse: string) => {
  const url = `${saksbehandlingApiBaseUrl}/api/aktivitetsplikt/${behandlingsreferanse}/grunnlag/brudd-11-7`;
  return await apiFetch<Aktivitetsplikt11_7Grunnlag>(url, saksbehandlingApiScope, 'GET');
};

export const hentAktivitetsplikt11_9Grunnlag = async (behandlingsreferanse: string) => {
  const url = `${saksbehandlingApiBaseUrl}/api/aktivitetsplikt/${behandlingsreferanse}/grunnlag/brudd-11-9`;
  return await apiFetch<Aktivitetsplikt11_9Grunnlag>(url, saksbehandlingApiScope, 'GET');
};

export const hentRettighetsinfo = async (saksnummer: string) => {
  const url = `${saksbehandlingApiBaseUrl}/api/sak/${saksnummer}/rettighetsinfo`;
  return await apiFetch<RettighetsinfoDto>(url, saksbehandlingApiScope, 'GET');
};

export const hentSvarFraAndreinstansGrunnlag = async (behandlingsreferanse: string) => {
  const url = `${saksbehandlingApiBaseUrl}/api/svar-fra-andreinstans/${behandlingsreferanse}/grunnlag/svar-fra-andreinstans`;
  return await apiFetch<SvarFraAndreinstansGrunnlag>(url, saksbehandlingApiScope, 'GET');
};

export const hentEtableringEgenVirksomhetGrunnlag = async (behandlingsreferanse: string) => {
  const url = `${saksbehandlingApiBaseUrl}/api/behandling/${behandlingsreferanse}/grunnlag/etableringegenvirksomhet`;
  return await apiFetch<EtableringEgenVirksomhetGrunnlagResponse>(url, saksbehandlingApiScope, 'GET');
};

export const hentFlyt = async (behandlingsreferanse: string) => {
  const url = `${saksbehandlingApiBaseUrl}/api/behandling/${behandlingsreferanse}/flyt`;
  return await apiFetch<BehandlingFlytOgTilstand>(url, saksbehandlingApiScope, 'GET', undefined, [
    `flyt/${behandlingsreferanse}`,
  ]);
};

// Requestene skal ikke caches ved polling
export const hentFlytUtenRequestMemoization = async (behandlingsreferanse: string) => {
  const url = `${saksbehandlingApiBaseUrl}/api/behandling/${behandlingsreferanse}/flyt`;
  return await apiFetchNoMemoization<BehandlingFlytOgTilstand>(url, saksbehandlingApiScope, 'GET');
};

export const hentUtbetalingOgSimuleringGrunnlag = async (behandlingsreferanse: string) => {
  const url = `${saksbehandlingApiBaseUrl}/api/behandling/${behandlingsreferanse}/utbetaling/simulering`;
  return await apiFetch<UtbetalingOgSimuleringGrunnlag[]>(url, saksbehandlingApiScope, 'GET', undefined, [
    `utbetalingogsimulering/${behandlingsreferanse}`,
  ]);
};

export const løsPeriodisertAvklaringsbehov = async (avklaringsBehov: LøsPeriodisertBehovPåBehandling) => {
  const url = `${saksbehandlingApiBaseUrl}/api/behandling/løs-periodisert-behov`;
  return await apiFetch<void>(url, saksbehandlingApiScope, 'POST', avklaringsBehov);
};

export const løsAvklaringsbehov = async (avklaringsBehov: LøsAvklaringsbehovPåBehandling) => {
  const url = `${saksbehandlingApiBaseUrl}/api/behandling/løs-behov`;
  return await apiFetch<void>(url, saksbehandlingApiScope, 'POST', avklaringsBehov);
};

export const mellomlagreBrev = async (brevbestillingReferanse: string, brev: Brev) => {
  const url = `${saksbehandlingApiBaseUrl}/api/brev/${brevbestillingReferanse}/oppdater`;
  return await apiFetch<void>(url, saksbehandlingApiScope, 'PUT', brev);
};

export const oppdaterBrevdata = async (brevbestillingReferanse: string, brevdata: BrevdataDto) => {
  const url = `${saksbehandlingApiBaseUrl}/api/brev/${brevbestillingReferanse}/oppdater-brevdata`;
  return await apiFetch<void>(url, saksbehandlingApiScope, 'PUT', brevdata);
};

export const oppdaterBrevmal = async (brevbestillingReferanse: string) => {
  const url = `${saksbehandlingApiBaseUrl}/api/brev/${brevbestillingReferanse}/oppdater-brevmal`;
  return await apiFetch<void>(url, saksbehandlingApiScope, 'PUT');
};

export const opprettDummySakDev = async (sak: OpprettTestcase) => {
  const url = `${saksbehandlingApiBaseUrl}/test/opprett`;
  return await apiFetch<void>(url, saksbehandlingApiScope, 'POST', sak);
};

export const opprettOgFullfoerDummySak = async (sak: OpprettTestcase) => {
  const url = `${saksbehandlingApiBaseUrl}/test/opprett-og-fullfoer`;
  return await apiFetch<void>(url, saksbehandlingApiScope, 'POST', sak);
};

export const leggTilDummyInst = async (saksnummer: string, body: object) => {
  const url = `${saksbehandlingApiBaseUrl}/test/endre/${saksnummer}/legg-til-institusjonsopphold`;
  return await apiFetch<void>(url, saksbehandlingApiScope, 'POST', body);
};

export const leggTilDummyYrkesskade = async (saksnummer: string) => {
  const url = `${saksbehandlingApiBaseUrl}/test/endre/${saksnummer}/legg-til-yrkesskade`;
  return await apiFetch<void>(url, saksbehandlingApiScope, 'POST');
};

export const opprettDummySakTest = async (sak: OpprettDummySakDto) => {
  const url = `${saksbehandlingApiBaseUrl}/api/test/opprettDummySak`;
  return await apiFetch<void>(url, saksbehandlingApiScope, 'POST', sak);
};

export const bestillTestBrev = async (bestilling: { behandlingsreferanse: string }) => {
  const url = `${saksbehandlingApiBaseUrl}/test/brev`;
  return await apiFetch<void>(url, saksbehandlingApiScope, 'POST', bestilling);
};

export const hentBeregningsGrunnlag = async (behandlingsreferanse: string) => {
  const url = `${saksbehandlingApiBaseUrl}/api/beregning/grunnlag/${behandlingsreferanse}`;
  return await apiFetch<BeregningsGrunnlag>(url, saksbehandlingApiScope, 'GET');
};

export const settBehandlingPåVent = async (behandlingsreferanse: string, requestBody: SettPåVent) => {
  const url = `${saksbehandlingApiBaseUrl}/api/behandling/${behandlingsreferanse}/sett-på-vent`;
  return await apiFetch(url, saksbehandlingApiScope, 'POST', requestBody);
};

export const hentBehandlingPåVentInformasjon = async (behandlingsreferanse: string) => {
  const url = `${saksbehandlingApiBaseUrl}/api/behandling/${behandlingsreferanse}/vente-informasjon`;
  return await apiFetch<VenteInformasjon>(url, saksbehandlingApiScope, 'GET');
};

export const forberedBehandlingOgVentPåProsessering = async (
  behandlingsreferanse: string
): Promise<undefined | FlytProsessering> => {
  const url = `${saksbehandlingApiBaseUrl}/api/behandling/${behandlingsreferanse}/forbered`;
  logInfo('Forbereder behandling ' + behandlingsreferanse);
  return await apiFetch(url, saksbehandlingApiScope, 'GET').then(() =>
    ventTilProsesseringErFerdig(behandlingsreferanse)
  );
};

export const hentAlleDialogmeldingerPåSak = async (saksnummer: string) => {
  const url = `${saksbehandlingApiBaseUrl}/api/dokumentinnhenting/syfo/status/${saksnummer}`;
  return await apiFetch<LegeerklæringStatus[]>(url, saksbehandlingApiScope, 'GET');
};

export const bestillDialogmelding = async (requestBody: BestillLegeerklæring) => {
  const url = `${saksbehandlingApiBaseUrl}/api/dokumentinnhenting/syfo/bestill`;
  return await apiFetch(url, saksbehandlingApiScope, 'POST', requestBody);
};

export const kanDistribuereBrev = async (brevbestillingReferanse: string, requestBody: KanDistribuereBrevRequest) => {
  const url = `${saksbehandlingApiBaseUrl}/api/${brevbestillingReferanse}/kan-distribuere-brev`;
  return await apiFetch<KanDistribuereBrevResponse>(url, saksbehandlingApiScope, 'POST', requestBody);
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

export const hentBarnepensjonGrunnlag = async (behandlingsreferanse: string) => {
  const url = `${saksbehandlingApiBaseUrl}/api/behandling/${behandlingsreferanse}/grunnlag/barnepensjon`;
  return await apiFetch<BarnepensjonGrunnlag>(url, saksbehandlingApiScope, 'GET');
};

export const hentVedtakslengdeGrunnlag = async (behandlingsreferanse: string) => {
  const url = `${saksbehandlingApiBaseUrl}/api/behandling/${behandlingsreferanse}/grunnlag/vedtakslengde`;
  return await apiFetch<VedtakslengdeGrunnlag>(url, saksbehandlingApiScope, 'GET');
};

export const hentForeslåVedtakGrunnlag = async (behandlingsreferanse: string) => {
  const url = `${saksbehandlingApiBaseUrl}/api/behandling/${behandlingsreferanse}/grunnlag/foreslaa-vedtak`;
  return await apiFetch<ForeslåVedtakGrunnlag>(url, saksbehandlingApiScope, 'GET');
};

export const hentForeslåVedtakVedtakslengdeGrunnlag = async (behandlingsreferanse: string) => {
  const url = `${saksbehandlingApiBaseUrl}/api/behandling/${behandlingsreferanse}/grunnlag/foreslaa-vedtak-vedtakslengde`;
  return await apiFetch<ForeslåVedtakVedtakslengdeGrunnlag>(url, saksbehandlingApiScope, 'GET');
};

export const hentForutgåendeMedlemskapsVurdering = async (behandlingsreferanse: string) => {
  const url = `${saksbehandlingApiBaseUrl}/api/lovvalgmedlemskap/forutgaaendevurdering/${behandlingsreferanse}`;
  return await apiFetch<AutomatiskLovvalgOgMedlemskapVurdering>(url, saksbehandlingApiScope, 'GET');
};

export const hentAutomatiskLovvalgOgMedlemskapVurdering = async (behandlingsreferanse: string) => {
  const url = `${saksbehandlingApiBaseUrl}/api/lovvalgmedlemskap/vurdering/${behandlingsreferanse}`;
  return await apiFetch<AutomatiskLovvalgOgMedlemskapVurdering>(url, saksbehandlingApiScope, 'GET');
};

export const hentRefusjonGrunnlag = async (behandlingsreferanse: string) => {
  const url = `${saksbehandlingApiBaseUrl}/api/behandling/${behandlingsreferanse}/grunnlag/refusjon`;
  return await apiFetch<RefusjonskravGrunnlag>(url, saksbehandlingApiScope, 'GET');
};

export const hentForhåndsvisningBrev = async (brevbestillingReferanse: string): Promise<Response> => {
  return apiFetchPdf(
    `${saksbehandlingApiBaseUrl}/api/brev/${brevbestillingReferanse}/forhandsvis`,
    saksbehandlingApiScope
  );
};

export const hentOppfølgingsoppgaveGrunnlag = async (behandlingsreferanse: string) => {
  return apiFetch<AvklarOppfolgingsoppgaveGrunnlagResponse>(
    `${saksbehandlingApiBaseUrl}/api/behandling/${behandlingsreferanse}/grunnlag/oppfolgingsoppgave`,
    saksbehandlingApiScope
  );
};

export const hentArbeidsOpptrappingGrunnlag = async (behandlingsreferanse: string) => {
  return apiFetch<ArbeidsopptrappingGrunnlagResponse>(
    `${saksbehandlingApiBaseUrl}/api/behandling/${behandlingsreferanse}/grunnlag/arbeidsopptrapping`,
    saksbehandlingApiScope
  );
};

export const hentMellomlagringMedStatus = (behandlingsreferanse: string, kode: string) => {
  return apiFetch<MellomlagretVurderingResponse>(
    `${saksbehandlingApiBaseUrl}/api/behandling/mellomlagret-vurdering/${behandlingsreferanse}/${kode}`,
    saksbehandlingApiScope
  );
};
export const hentMellomlagring = async (behandlingsreferanse: string, kode: string) => {
  const res = await hentMellomlagringMedStatus(behandlingsreferanse, kode);

  if (isSuccess(res)) {
    if (res.data.mellomlagretVurdering !== null) {
      return res.data.mellomlagretVurdering;
    }

    return undefined;
  }
};

export const hentForeløpigBehandlingsutfall = async (
  behandlingsreferanse: string,
  førSteg: StegType,
  etterSteg: StegType
) => {
  return apiFetch<ForeløpigBehandlingsutfall>(
    `${saksbehandlingApiBaseUrl}/api/behandling/${behandlingsreferanse}/tidligere-vurderinger?førSteg=${førSteg}&etterSteg=${etterSteg}`,
    saksbehandlingApiScope
  );
};

export const hentOppfølgningsOppgaverOpprinselsePåBehandlingsReferanse = async (
  behandlingsreferanse: string,
  kode: string
) => {
  return apiFetch<OppfølgningOppgaveOpprinnelseResponse>(
    `${saksbehandlingApiBaseUrl}/api/behandling/oppfølgningOppgaveOpprinnelse/${behandlingsreferanse}/${kode}`,
    saksbehandlingApiScope
  );
};

export const lagreMellomlagring = async (request: MellomlagretVurderingRequest) => {
  return apiFetch<MellomlagretVurderingResponse>(
    `${saksbehandlingApiBaseUrl}/api/behandling/mellomlagret-vurdering/${request.behandlingsReferanse}`,
    saksbehandlingApiScope,
    'POST',
    request
  );
};

export const slettMellomlagring = async (behandlingsreferanse: string, kode: Behovstype) => {
  return apiFetch(
    `${saksbehandlingApiBaseUrl}/api/behandling/mellomlagret-vurdering/${behandlingsreferanse}/${kode}/slett`,
    saksbehandlingApiScope,
    'POST'
  );
};

export const hentAktivitetspliktTrekk = async (saksnummer: string) => {
  return apiFetch<AktivitetspliktMedTrekkRespons>(
    `${saksbehandlingApiBaseUrl}/api/aktivitetsplikt/trekk/${saksnummer}`,
    saksbehandlingApiScope
  );
};

export const hentMeldekort = async (saksnummer: string) => {
  return apiFetch<AktivitetspliktMedTrekkRespons>(
    `${saksbehandlingApiBaseUrl}/api/meldekort/${saksnummer}`,
    saksbehandlingApiScope
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
    if (isError(response)) {
      logError(
        `ventTilProssesering hentFlyt: Behandlingsreferanse: [${behandlingsreferanse}] - ${response.status} - ${response.apiException.code}: ${response.apiException.message}`
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
