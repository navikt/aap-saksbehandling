import {
  AktivitetspliktGrunnlag,
  AktivitetspliktHendelser,
  AlderGrunnlag,
  ArbeidsevneGrunnlag,
  AutomatiskLovvalgOgMedlemskapVurdering,
  BarnetilleggGrunnlag,
  BehandlendeEnhetGrunnlag,
  BehandlingFlytOgTilstand,
  BehandlingPersoninfo,
  BeregningsGrunnlag,
  BeregningTidspunktGrunnlag,
  BestillLegeerklæring,
  BistandsGrunnlag,
  Brev,
  BrevGrunnlag,
  DetaljertBehandling,
  EffektuerAvvistPåFormkravGrunnlag,
  FatteVedtakGrunnlag,
  FlytProsessering,
  ForhåndsvisDialogmelding,
  ForhåndsvisDialogmeldingResponse,
  FormkravGrunnlag,
  ForutgåendeMedlemskapGrunnlag,
  FritakMeldepliktGrunnlag,
  HelseinstitusjonGrunnlag,
  KlagebehandlingKontorGrunnlag,
  KlagebehandlingNayGrunnlag,
  Klageresultat,
  KvalitetssikringGrunnlag,
  LegeerklæringStatus,
  LovvalgMedlemskapGrunnlag,
  LøsAvklaringsbehovPåBehandling,
  ManuellInntektGrunnlag,
  OppdaterAktivitetspliktBrudd2,
  OpprettAktivitetspliktBrudd,
  OpprettTestcase,
  PåklagetBehandlingGrunnlag,
  RefusjonskravGrunnlag,
  RettighetsperiodeGrunnlag,
  SakPersoninfo,
  SaksInfo,
  SamordningAndreStatligeYtelserGrunnlag,
  SamordningGraderingGrunnlag,
  SamordningTjenestePensjonGrunnlag,
  SamordningUføreGrunnlag,
  SettPåVent,
  Soningsgrunnlag,
  StudentGrunnlag,
  SykdomsGrunnlag,
  SykepengeerstatningGrunnlag,
  TilkjentYtelseGrunnlag,
  TrekkKlageGrunnlag,
  TrukketSøknadGrunnlag,
  UnderveisGrunnlag,
  UtbetalingOgSimuleringGrunnlag,
  VenteInformasjon,
  YrkeskadeBeregningGrunnlag,
  YrkesskadeVurderingGrunnlag,
} from 'lib/types/types';
import { apiFetch, apiFetchPdf } from 'lib/services/apiFetch';
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
  return await apiFetch<{}>(url, saksbehandlingApiScope, 'POST', aktivitet);
};

export const oppdaterBruddPåAktivitetsplikten = async (
  saksnummer: string,
  aktivitet: OppdaterAktivitetspliktBrudd2
) => {
  const url = `${saksbehandlingApiBaseUrl}/api/sak/${saksnummer}/aktivitetsplikt/oppdater`;
  return await apiFetch<{}>(url, saksbehandlingApiScope, 'POST', aktivitet);
};

export const hentAktivitetspliktHendelser = async (saksnummer: string) => {
  const url = `${saksbehandlingApiBaseUrl}/api/sak/${saksnummer}/aktivitetsplikt`;
  return await apiFetch<AktivitetspliktHendelser>(url, saksbehandlingApiScope, 'GET', undefined, [
    `aktivitetsplikt/${saksnummer}`,
  ]);
};

export const finnSakerForIdent = async (ident: string) => {
  const url = `${saksbehandlingApiBaseUrl}/api/sak/finn`;
  return await apiFetch<SaksInfo[]>(url, saksbehandlingApiScope, 'POST', { ident });
};
export const hentAlleSaker = async () => {
  const url = `${saksbehandlingApiBaseUrl}/api/sak/alle`;
  return await apiFetch<SaksInfo[]>(url, saksbehandlingApiScope, 'GET');
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

export const hentSamordningTjenestePensjonGrunnlag = async (behandlingsReferanse: string) => {
  const url = `${saksbehandlingApiBaseUrl}/api/behandling/${behandlingsReferanse}/grunnlag/samordning/tjenestepensjon`;
  return await apiFetch<SamordningTjenestePensjonGrunnlag>(url, saksbehandlingApiScope, 'GET');
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

export const hentManuellInntektGrunnlag = async (behandlingsReferanse: string) => {
  const url = `${saksbehandlingApiBaseUrl}/api/behandling/${behandlingsReferanse}/grunnlag/beregning/manuellinntekt`;
  return apiFetch<ManuellInntektGrunnlag>(url, saksbehandlingApiScope, 'GET');
};

export const hentSoningsvurdering = async (behandlingsreferanse: string) => {
  const url = `${saksbehandlingApiBaseUrl}/api/behandling/${behandlingsreferanse}/grunnlag/institusjon/soning`;
  return apiFetch<Soningsgrunnlag>(url, saksbehandlingApiScope, 'GET');
};

export const hentTilkjentYtelse = async (behandlingsReferanse: string) => {
  const url = `${saksbehandlingApiBaseUrl}/api/behandling/tilkjent/${behandlingsReferanse}`;
  return await apiFetch<TilkjentYtelseGrunnlag>(url, saksbehandlingApiScope, 'GET');
};

export const hentTrukketSøknad = async (behandlingsreferanse: string) => {
  const url = `${saksbehandlingApiBaseUrl}/api/behandling/${behandlingsreferanse}/grunnlag/trukket-søknad`;
  return await apiFetch<TrukketSøknadGrunnlag>(url, saksbehandlingApiScope, 'GET');
};

export const hentRettighetsperiodeGrunnlag = async (behandlingsreferanse: string) => {
  const url = `${saksbehandlingApiBaseUrl}/api/behandling/${behandlingsreferanse}/grunnlag/rettighetsperiode`;
  return await apiFetch<RettighetsperiodeGrunnlag>(url, saksbehandlingApiScope, 'GET');
};

export const hentFormkravGrunnlag = async (behandlingsReferanse: string) => {
  const url = `${saksbehandlingApiBaseUrl}/api/klage/${behandlingsReferanse}/grunnlag/formkrav`;
  return await apiFetch<FormkravGrunnlag>(url, saksbehandlingApiScope, 'GET');
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

export const hentEffektuerAvvistPåFormkravGrunnlag = async (behandlingsReferanse: string) => {
  const url = `${saksbehandlingApiBaseUrl}/api/klage/${behandlingsReferanse}/grunnlag/effektuer-avvist-på-formkrav`;
  return await apiFetch<EffektuerAvvistPåFormkravGrunnlag>(url, saksbehandlingApiScope, 'GET');
};

export const hentFlyt = async (behandlingsReferanse: string) => {
  const url = `${saksbehandlingApiBaseUrl}/api/behandling/${behandlingsReferanse}/flyt`;
  return await apiFetch<BehandlingFlytOgTilstand>(url, saksbehandlingApiScope, 'GET', undefined, [
    `flyt/${behandlingsReferanse}`,
  ]);
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

export const opprettTestSak = async (sak: OpprettTestcase) => {
  const url = `${saksbehandlingApiBaseUrl}/test/opprett`;
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
  return apiFetchPdf(
    `${saksbehandlingApiBaseUrl}/api/brev/${brevbestillingReferanse}/forhandsvis`,
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

    const response = await hentFlyt(behandlingsreferanse);
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
