import { components, paths } from './schema';
import { components as oppgave } from '@navikt/aap-oppgave-typescript-types';

// Grunnlag
export type StudentGrunnlag =
  components['schemas']['no.nav.aap.behandlingsflyt.behandling.student.StudentGrunnlagResponse'];
export type SykestipendGrunnlag =
  components['schemas']['no.nav.aap.behandlingsflyt.behandling.student.sykestipend.SykestipendGrunnlagResponse'];
export type SykdomsGrunnlag =
  components['schemas']['no.nav.aap.behandlingsflyt.behandling.beregning.grunnlag.sykdom.sykdom.SykdomGrunnlagResponse'];
export type Sykdomvurdering =
  components['schemas']['no.nav.aap.behandlingsflyt.behandling.beregning.grunnlag.sykdom.sykdom.SykdomsvurderingResponse'];
export type SykdomsvurderingBrevGrunnlag =
  components['schemas']['no.nav.aap.behandlingsflyt.behandling.brev.SykdomsvurderingForBrevDto'];
export type SykepengeerstatningGrunnlag =
  components['schemas']['no.nav.aap.behandlingsflyt.behandling.beregning.grunnlag.sykdom.sykepengergrunnlag.SykepengerGrunnlagResponse'];
export type SykepengerVurderingResponse =
  components['schemas']['no.nav.aap.behandlingsflyt.behandling.beregning.grunnlag.sykdom.sykepengergrunnlag.SykepengerVurderingResponse'];

export type SykepengererstatningPeriodeLøsning =
  components['schemas']['no.nav.aap.behandlingsflyt.faktagrunnlag.saksbehandler.sykdom.flate.PeriodisertSykepengerVurderingDto'];

export type SykdomsvurderingLøsningDto =
  components['schemas']['no.nav.aap.behandlingsflyt.faktagrunnlag.saksbehandler.sykdom.flate.SykdomsvurderingL\u00F8sningDto'];

export type SykepengeerstatningVurderingGrunn =
  components['schemas']['no.nav.aap.behandlingsflyt.behandling.beregning.grunnlag.sykdom.sykepengergrunnlag.SykepengerVurderingResponse']['grunn'];
export type BistandsGrunnlag =
  components['schemas']['no.nav.aap.behandlingsflyt.behandling.beregning.grunnlag.sykdom.bistand.BistandGrunnlagResponse'];
export type BistandVurderingResponse =
  components['schemas']['no.nav.aap.behandlingsflyt.behandling.beregning.grunnlag.sykdom.bistand.BistandVurderingResponse'];

export type OvergangUforeGrunnlag =
  components['schemas']['no.nav.aap.behandlingsflyt.behandling.beregning.grunnlag.sykdom.overgangufore.OvergangUf\u00F8reGrunnlagResponse'];

export type OvergangUforeLøsning =
  components['schemas']['no.nav.aap.behandlingsflyt.faktagrunnlag.saksbehandler.overgangufore.flate.OvergangUf\u00F8reL\u00F8sningDto'];

export type OvergangArbeidGrunnlag =
  components['schemas']['no.nav.aap.behandlingsflyt.behandling.beregning.grunnlag.sykdom.overgangarbeid.OvergangArbeidGrunnlagResponse'];

export type FritakMeldepliktGrunnlag =
  components['schemas']['no.nav.aap.behandlingsflyt.behandling.beregning.grunnlag.fritakmeldeplikt.FritakMeldepliktGrunnlagResponse'];

export type PeriodisertFritaksvurderingDto =
  components['schemas']['no.nav.aap.behandlingsflyt.faktagrunnlag.saksbehandler.meldeplikt.flate.PeriodisertFritaksvurderingDto'];

export type OverstyringMeldepliktGrunnlag =
  components['schemas']['no.nav.aap.behandlingsflyt.behandling.underveis.MeldepliktOverstyringGrunnlagResponse'];
export type MeldepliktOverstyringLøsningDto =
  components['schemas']['no.nav.aap.behandlingsflyt.faktagrunnlag.saksbehandler.meldeplikt.flate.MeldepliktOverstyringL\u00F8sningDto'];
export type OverstyringMeldepliktGrunnlagVurdering =
  components['schemas']['no.nav.aap.behandlingsflyt.behandling.underveis.MeldepliktOverstyringVurderingResponse'];
export type MeldepliktOverstyringStatus = 'RIMELIG_GRUNN' | 'IKKE_MELDT_SEG' | 'HAR_MELDT_SEG';
export type ArbeidsevneGrunnlag =
  components['schemas']['no.nav.aap.behandlingsflyt.behandling.arbeidsevne.ArbeidsevneGrunnlagDto'];

export type PeriodisertArbeidsevneVurderingDto =
  components['schemas']['no.nav.aap.behandlingsflyt.faktagrunnlag.saksbehandler.arbeidsevne.flate.PeriodisertFastsettArbeidsevneDto'];

export type BarnepensjonGrunnlag =
  components['schemas']['no.nav.aap.behandlingsflyt.behandling.barnepensjon.BarnepensjonGrunnlagDto'];

export type BarnepensjonVurdering =
  components['schemas']['no.nav.aap.behandlingsflyt.behandling.barnepensjon.BarnepensjonVurderingDto'];

export type RefusjonskravGrunnlag =
  components['schemas']['no.nav.aap.behandlingsflyt.behandling.beregning.grunnlag.refusjon.RefusjonkravGrunnlagResponse'];
export type RefusjonkravVurderingResponse =
  components['schemas']['no.nav.aap.behandlingsflyt.behandling.beregning.grunnlag.refusjon.RefusjonkravVurderingResponse'];

export type BeregningTidspunktGrunnlag =
  components['schemas']['no.nav.aap.behandlingsflyt.behandling.beregning.tidspunkt.BeregningTidspunktAvklaringResponse'];
export type BeregningstidspunktVurderingResponse =
  components['schemas']['no.nav.aap.behandlingsflyt.behandling.beregning.tidspunkt.BeregningstidspunktVurderingResponse'];

export type TilkjentYtelseGrunnlag =
  components['schemas']['no.nav.aap.behandlingsflyt.behandling.tilkjentytelse.TilkjentYtelse2Dto'];

export type TilkjentYtelsePeriode =
  components['schemas']['no.nav.aap.behandlingsflyt.behandling.tilkjentytelse.TilkjentYtelsePeriode2Dto'];

type TilkjentYtelseGrunnlagMedDiffFraSchema =
  components['schemas']['no.nav.aap.behandlingsflyt.behandling.tilkjentytelse.TilkjentYtelse2MedDiffDto'];

export type DiffUendret<T> = {
  diff: 'Uendret';
  uendret: T;
};

export type DiffEndret<T> = {
  diff: 'Endret';
  fra: T;
  til: T;
};

export type DiffFjernet<T> = {
  diff: 'Fjernet';
  fjernet: T;
};

export type DiffLagtTil<T> = {
  diff: 'LagtTil';
  lagtTil: T;
};

export type Diff<T> = DiffUendret<T> | DiffEndret<T> | DiffFjernet<T> | DiffLagtTil<T>;

export type TilkjentYtelseGrunnlagMedDiff = Omit<TilkjentYtelseGrunnlagMedDiffFraSchema, 'perioder'> & {
  perioder: Diff<TilkjentYtelsePeriode>[];
};

// Type guards for Diff-utledning
export function erDiffUendret<T>(d: Diff<T>): d is DiffUendret<T> {
  return d.diff === 'Uendret';
}
export function erDiffEndret<T>(d: Diff<T>): d is DiffEndret<T> {
  return d.diff === 'Endret';
}
export function erDiffFjernet<T>(d: Diff<T>): d is DiffFjernet<T> {
  return d.diff === 'Fjernet';
}

export function erDiffLagtTil<T>(d: Diff<T>): d is DiffLagtTil<T> {
  return d.diff === 'LagtTil';
}

export type KvalitetssikringGrunnlag =
  components['schemas']['no.nav.aap.behandlingsflyt.behandling.kvalitetssikring.KvalitetssikringGrunnlagDto'];
export type KvalitetssikringTilgang =
  components['schemas']['no.nav.aap.behandlingsflyt.behandling.kvalitetssikring.KvalitetssikringTilgangDto'];
export type BarnetilleggGrunnlag =
  components['schemas']['no.nav.aap.behandlingsflyt.behandling.barnetillegg.BarnetilleggDto'];
export type Soningsgrunnlag =
  components['schemas']['no.nav.aap.behandlingsflyt.behandling.institusjonsopphold.SoningsGrunnlagDto'];
export type HelseinstitusjonGrunnlag =
  components['schemas']['no.nav.aap.behandlingsflyt.behandling.institusjonsopphold.HelseinstitusjonGrunnlagDto'];
export type Institusjonsopphold =
  components['schemas']['no.nav.aap.behandlingsflyt.behandling.institusjonsopphold.InstitusjonsoppholdDto'];
export type HelseInstiusjonVurdering =
  components['schemas']['no.nav.aap.behandlingsflyt.behandling.institusjonsopphold.HelseinstitusjonVurderingDto'];

export type FatteVedtakGrunnlag =
  components['schemas']['no.nav.aap.behandlingsflyt.behandling.avklaringsbehov.FatteVedtakGrunnlagDto'];

export type AlderGrunnlag =
  components['schemas']['no.nav.aap.behandlingsflyt.behandling.beregning.grunnlag.alder.AlderDTO'];
export type BekreftVurderingerOppfølgingGrunnlag =
  components['schemas']['no.nav.aap.behandlingsflyt.behandling.bekreftvurderingeroppfølging.BekreftVurderingerOppfølgingDto'];

export type BrevGrunnlag = components['schemas']['no.nav.aap.behandlingsflyt.behandling.brev.BrevGrunnlag'];
export type BrevGrunnlagBrev = components['schemas']['no.nav.aap.behandlingsflyt.behandling.brev.BrevGrunnlag.Brev'];
export type Brev = components['schemas']['no.nav.aap.brev.kontrakt.Brev'];
export type BrevStatus =
  components['schemas']['no.nav.aap.behandlingsflyt.behandling.brev.BrevGrunnlag.Brev']['status'];
export type BrevMottaker =
  components['schemas']['no.nav.aap.behandlingsflyt.behandling.brev.BrevGrunnlag.Brev.Mottaker'];
export type KanDistribuereBrevRequest = components['schemas']['no.nav.aap.brev.kontrakt.KanDistribuereBrevRequest'];
export type KanDistribuereBrevResponse = components['schemas']['no.nav.aap.brev.kontrakt.KanDistribuereBrevReponse'];
export type Signatur = components['schemas']['no.nav.aap.brev.kontrakt.Signatur'];
export type Mottaker =
  components['schemas']['no.nav.aap.behandlingsflyt.behandling.avklaringsbehov.løsning.SkrivVedtaksbrevLøsning']['mottakere'][number];
export type SamordningTjenestePensjonGrunnlag =
  components['schemas']['no.nav.aap.behandlingsflyt.behandling.grunnlag.samordning.TjenestepensjonGrunnlagDTO'];
export type SamordningGraderingGrunnlag =
  components['schemas']['no.nav.aap.behandlingsflyt.behandling.grunnlag.samordning.SamordningYtelseVurderingGrunnlagDTO'];
export type SamordningYtelseVurdering =
  components['schemas']['no.nav.aap.behandlingsflyt.behandling.grunnlag.samordning.SamordningYtelseVurderingDTO'];
export type SamordningGraderingYtelse =
  components['schemas']['no.nav.aap.behandlingsflyt.behandling.grunnlag.samordning.SamordningYtelseDTO'];
export type SamordningYtelsestype =
  components['schemas']['no.nav.aap.behandlingsflyt.behandling.grunnlag.samordning.SamordningYtelseDTO']['ytelseType'];
export type SamordningUføreGrunnlag =
  components['schemas']['no.nav.aap.behandlingsflyt.behandling.grunnlag.samordning.SamordningUføreVurderingGrunnlagDTO'];
export type SamordningAndreStatligeYtelserGrunnlag =
  components['schemas']['no.nav.aap.behandlingsflyt.behandling.grunnlag.samordning.SamordningAndreStatligeYtelserGrunnlagDTO'];
export type AndreStatligeYtelserPeriodeDto =
  components['schemas']['no.nav.aap.behandlingsflyt.behandling.grunnlag.samordning.AndreStatligeYtelserPeriodeDto'];
export type AndreStatligeYtelserKilde =
  components['schemas']['no.nav.aap.behandlingsflyt.behandling.grunnlag.samordning.AndreStatligeYtelserPeriodeDto']['kilde'];
export type AndreStatligeYtelserType =
  components['schemas']['no.nav.aap.behandlingsflyt.behandling.grunnlag.samordning.AndreStatligeYtelserPeriodeDto']['ytelseType'];
export type DagpengerYtelserType =
  components['schemas']['no.nav.aap.behandlingsflyt.test.modell.TestPerson.Dagpenger']['dagpengerYtelseType'];
export type DagpengerKilde =
  components['schemas']['no.nav.aap.behandlingsflyt.test.modell.TestPerson.Dagpenger']['kilde'];
export type TiltakspengerYtelserType =
  components['schemas']['no.nav.aap.behandlingsflyt.test.modell.TestPerson.Tiltakspenger']['ytelseType'];
export type TiltakspengerKilde =
  components['schemas']['no.nav.aap.behandlingsflyt.test.modell.TestPerson.Tiltakspenger']['kilde'];
export type SamordningAndreStatligeYtelserVurderinger =
  components['schemas']['no.nav.aap.behandlingsflyt.behandling.grunnlag.samordning.SamordningAndreStatligeYtelserVurderingDTO'];

export type SamordningArbeidsgiverGrunnlag =
  components['schemas']['no.nav.aap.behandlingsflyt.behandling.grunnlag.samordning.SamordningArbeidsgiverGrunnlagDTO'];

export type SamordningArbeidsgiverVurdering =
  components['schemas']['no.nav.aap.behandlingsflyt.behandling.grunnlag.samordning.SamordningArbeidsgiverVurderingDTO'];

export type SamordningAndreStatligeYtelserData =
  components['schemas']['no.nav.aap.behandlingsflyt.faktagrunnlag.delvurdering.samordning.andrestatligeytelservurdering.SamordningAndreStatligeYtelserVurderingPeriodeDto'];

export type SamordningAndreStatligeYtelserYtelse =
  components['schemas']['no.nav.aap.behandlingsflyt.faktagrunnlag.delvurdering.samordning.andrestatligeytelservurdering.SamordningAndreStatligeYtelserVurderingPeriodeDto']['ytelse'];

export type KravGrunnlag = components['schemas']['no.nav.aap.behandlingsflyt.behandling.krav.KravGrunnlagDto'];

export type KravVurdering = components['schemas']['no.nav.aap.behandlingsflyt.behandling.krav.KravVurderingDto'];

export type NyttKrav = components['schemas']['no.nav.aap.behandlingsflyt.behandling.krav.NyttKravDto'];

export type Gjenopptak = components['schemas']['no.nav.aap.behandlingsflyt.behandling.krav.GjenopptakDto'];

export type Tilleggsopplysning =
  components['schemas']['no.nav.aap.behandlingsflyt.behandling.krav.TilleggsopplysningDto'];

export type Søknadsdato =
  components['schemas']['no.nav.aap.behandlingsflyt.behandling.krav.NyttKravDto']['søknadsdato'];

export type OverstyrMuligRettFra =
  components['schemas']['no.nav.aap.behandlingsflyt.behandling.krav.NyttKravDto']['overstyrMuligRettFra'];

export type KravVurderingLøsning =
  components['schemas']['no.nav.aap.behandlingsflyt.faktagrunnlag.saksbehandler.krav.KravVurderingLøsningDto'];

export type NyttKravLøsning =
  components['schemas']['no.nav.aap.behandlingsflyt.faktagrunnlag.saksbehandler.krav.NyttKravLøsningDto'];

export type GjenopptakKravLøsning =
  components['schemas']['no.nav.aap.behandlingsflyt.faktagrunnlag.saksbehandler.krav.GjenopptakKravLøsningDto'];

export type KlageKravLøsning =
  components['schemas']['no.nav.aap.behandlingsflyt.faktagrunnlag.saksbehandler.krav.KlageKravLøsningDto'];

export type TilleggsopplysningKravLøsning =
  components['schemas']['no.nav.aap.behandlingsflyt.faktagrunnlag.saksbehandler.krav.TilleggsopplysningKravLøsningDto'];

export type TrukketSøknadKravLøsning =
  components['schemas']['no.nav.aap.behandlingsflyt.faktagrunnlag.saksbehandler.krav.TrukketSøknadKravLøsningDto'];

export type SøknadUtenKrav = components['schemas']['no.nav.aap.behandlingsflyt.behandling.krav.SøknadUtenKravDto'];

export type TrukketSøknadGrunnlag =
  components['schemas']['no.nav.aap.behandlingsflyt.behandling.søknad.TrukketSøknadGrunnlagDto'];

export type TrukketSøknadVurdering =
  components['schemas']['no.nav.aap.behandlingsflyt.behandling.søknad.TrukketSøknadVurderingDto'];

export type AvbrytRevurderingGrunnlag =
  components['schemas']['no.nav.aap.behandlingsflyt.behandling.revurdering.AvbrytRevurderingGrunnlagDto'];

export type AvbrytAktivitetspliktbehandlingGrunnlag =
  components['schemas']['no.nav.aap.behandlingsflyt.behandling.aktivitetsplikt.avbrytaktivitetspliktbehandling.AvbrytAktivitetspliktbehandlingGrunnlagDto'];

export type RettighetsinfoDto =
  components['schemas']['no.nav.aap.behandlingsflyt.behandling.rettighet.RettighetsinfoDto'];

export type RettighetsperiodeGrunnlag =
  components['schemas']['no.nav.aap.behandlingsflyt.behandling.rettighetsperiode.RettighetsperiodeGrunnlagResponse'];
export type FullmektigGrunnlag =
  components['schemas']['no.nav.aap.behandlingsflyt.behandling.klage.fullmektig.FullmektigGrunnlagDto'];
export type FullmektigVurdering =
  components['schemas']['no.nav.aap.behandlingsflyt.behandling.klage.fullmektig.FullmektigVurderingDto'];
export type FormkravGrunnlag =
  components['schemas']['no.nav.aap.behandlingsflyt.behandling.klage.formkrav.FormkravGrunnlagDto'];
export type PåklagetBehandlingGrunnlag =
  components['schemas']['no.nav.aap.behandlingsflyt.behandling.klage.påklagetbehandling.PåklagetBehandlingGrunnlagDto'];
export type BehandlendeEnhetGrunnlag =
  components['schemas']['no.nav.aap.behandlingsflyt.behandling.klage.behandlendeenhet.BehandlendeEnhetGrunnlagDto'];
export type KlagebehandlingKontorGrunnlag =
  components['schemas']['no.nav.aap.behandlingsflyt.behandling.klage.klagebehandling.KlagebehandlingKontorGrunnlagDto'];
export type KlagebehandlingNayGrunnlag =
  components['schemas']['no.nav.aap.behandlingsflyt.behandling.klage.klagebehandling.KlagebehandlingNayGrunnlagDto'];
export type Hjemmel =
  components['schemas']['no.nav.aap.behandlingsflyt.faktagrunnlag.klage.klagebehandling.kontor.KlagevurderingKontorLøsningDto']['vilkårSomOmgjøres'][number];
export type KlageInnstilling =
  components['schemas']['no.nav.aap.behandlingsflyt.faktagrunnlag.klage.klagebehandling.kontor.KlagevurderingKontorLøsningDto']['innstilling'];
export type Klageresultat =
  components['schemas']['no.nav.aap.behandlingsflyt.faktagrunnlag.klage.resultat.KlageResultat'];
export type KabalKlageResultat =
  components['schemas']['no.nav.aap.behandlingsflyt.behandling.klage.resultat.KabalKlageResultat'];
export type TrekkKlageGrunnlag =
  components['schemas']['no.nav.aap.behandlingsflyt.behandling.klage.trekk.TrekkKlageGrunnlagDto'];

export type SvarFraAndreinstansGrunnlag =
  components['schemas']['no.nav.aap.behandlingsflyt.behandling.svarfraandreinstans.svarfraandreinstans.SvarFraAndreinstansGrunnlagDto'];
export type SvarFraAndreinstansVurdering =
  components['schemas']['no.nav.aap.behandlingsflyt.behandling.svarfraandreinstans.svarfraandreinstans.SvarFraAndreinstansVurderingDto'];
export type SvarKonsekvens =
  components['schemas']['no.nav.aap.behandlingsflyt.behandling.avklaringsbehov.løsning.HåndterSvarFraAndreinstansLøsningDto']['konsekvens'];
export type KabalUtfall = SvarFraAndreinstansGrunnlag['svarFraAndreinstans']['utfall'];
export type KabalSvarType = SvarFraAndreinstansGrunnlag['svarFraAndreinstans']['type'];
export type KabalBehandlingDetaljer =
  components['schemas']['no.nav.aap.behandlingsflyt.kontrakt.hendelse.dokumenter.BehandlingDetaljer'];
export type UtbetalingOgSimuleringGrunnlag =
  components['schemas']['no.nav.aap.utbetal.simulering.UtbetalingOgSimuleringDto'];
export type SimulertUtbetaling = components['schemas']['no.nav.aap.utbetal.simulering.SimulertUtbetalingDto'];

// Behandling
export type DetaljertBehandling = components['schemas']['no.nav.aap.behandlingsflyt.flyt.DetaljertBehandlingDTO'];
export type Arenastatus = components['schemas']['no.nav.aap.behandlingsflyt.flyt.ArenaStatusDTO'];
export type BehandlingFlytOgTilstand =
  components['schemas']['no.nav.aap.behandlingsflyt.flyt.BehandlingFlytOgTilstandDto'];
export type FlytGruppe = components['schemas']['no.nav.aap.behandlingsflyt.flyt.FlytGruppe'];
export type FlytVisning = components['schemas']['no.nav.aap.behandlingsflyt.flyt.flate.visning.Visning'];
export type TypeBehandling =
  components['schemas']['no.nav.aap.behandlingsflyt.flyt.flate.visning.Visning']['typeBehandling'];

export type LøsAvklaringsbehovPåBehandling =
  components['schemas']['no.nav.aap.behandlingsflyt.behandling.avklaringsbehov.flate.LøsAvklaringsbehovPåBehandling'];
export type LøsPeriodisertBehovPåBehandling =
  components['schemas']['no.nav.aap.behandlingsflyt.behandling.avklaringsbehov.flate.L\u00F8sPeriodisertAvklaringsbehovP\u00E5Behandling'];

export type KvalitetssikringLøsning =
  components['schemas']['no.nav.aap.behandlingsflyt.behandling.avklaringsbehov.l\u00F8sning.KvalitetssikringL\u00F8sning'];
export type FatteVedtakLøsning =
  components['schemas']['no.nav.aap.behandlingsflyt.behandling.avklaringsbehov.løsning.FatteVedtakLøsning'];

// Sak
export type SaksInfo = components['schemas']['no.nav.aap.behandlingsflyt.sakogbehandling.sak.flate.UtvidetSaksinfoDTO'];
export type SakPersoninfo =
  components['schemas']['no.nav.aap.behandlingsflyt.sakogbehandling.sak.flate.SakPersoninfoDTO'];
export type BehandlingsHistorikk =
  components['schemas']['no.nav.aap.behandlingsflyt.sakogbehandling.sak.flate.BehandlingHistorikkDTO'];
export type SøkPåSakInfo = components['schemas']['no.nav.aap.behandlingsflyt.sakogbehandling.sak.flate.SøkPåSakDTO'];

export type OpprettTestcase = components['schemas']['no.nav.aap.behandlingsflyt.OpprettTestcaseDTO'];
export type TestcaseSteg = components['schemas']['no.nav.aap.behandlingsflyt.OpprettTestcaseDTO']['steg'];
export type OpprettDummySakDto = components['schemas']['no.nav.aap.behandlingsflyt.test.OpprettDummySakDto'];
export type FinnSakForIdent =
  components['schemas']['no.nav.aap.behandlingsflyt.sakogbehandling.sak.flate.FinnSakForIdentDTO'];

export type Vilkår = components['schemas']['no.nav.aap.behandlingsflyt.flyt.VilkårDTO'];

export type Avklaringsbehov = components['schemas']['no.nav.aap.behandlingsflyt.flyt.AvklaringsbehovDTO'];

export type StegType = components['schemas']['no.nav.aap.behandlingsflyt.flyt.FlytSteg']['stegType'];

export type StegGruppe = components['schemas']['no.nav.aap.behandlingsflyt.flyt.FlytGruppe']['stegGruppe'];

export type ToTrinnsVurdering =
  components['schemas']['no.nav.aap.behandlingsflyt.behandling.avklaringsbehov.løser.vedtak.TotrinnsVurdering'];

export type ToTrinnsVurderingGrunn =
  components['schemas']['no.nav.aap.behandlingsflyt.behandling.avklaringsbehov.ÅrsakTilRetur']['årsak'];

export type HistorikkType =
  components['schemas']['no.nav.aap.behandlingsflyt.behandling.avklaringsbehov.flate.Historikk'];

export type HistorikkAksjon =
  components['schemas']['no.nav.aap.behandlingsflyt.behandling.avklaringsbehov.flate.Historikk']['aksjon'];

export type FlytProsessering =
  components['schemas']['no.nav.aap.behandlingsflyt.flyt.BehandlingFlytOgTilstandDto']['prosessering'];

export type FlytProsesseringStatus =
  components['schemas']['no.nav.aap.behandlingsflyt.flyt.BehandlingFlytOgTilstandDto']['prosessering']['status'];

export type BeregningsGrunnlag = components['schemas']['no.nav.aap.behandlingsflyt.behandling.beregning.BeregningDTO'];

export type GjeldendeGrunnbeløp =
  components['schemas']['no.nav.aap.behandlingsflyt.behandling.beregning.GjeldendeGrunnbeløpDTO'];

export type Grunnlag1119 = components['schemas']['no.nav.aap.behandlingsflyt.behandling.beregning.Grunnlag11_19DTO'];

export type UføreGrunnlag = components['schemas']['no.nav.aap.behandlingsflyt.behandling.beregning.UføreGrunnlagDTO'];

export type YrkesskadeGrunnlag =
  components['schemas']['no.nav.aap.behandlingsflyt.behandling.beregning.YrkesskadeGrunnlagDTO'];

export type YrkesskadeUføreGrunnlag =
  components['schemas']['no.nav.aap.behandlingsflyt.behandling.beregning.YrkesskadeUføreGrunnlagDTO'];

export type Yrkesskadevurdering =
  components['schemas']['no.nav.aap.behandlingsflyt.behandling.avklaringsbehov.løsning.YrkesskadevurderingDto'];

export type AvklarOppholdkravLøsning =
  components['schemas']['no.nav.aap.behandlingsflyt.behandling.oppholdskrav.AvklarOppholdkravLøsningForPeriodeDto'];
export type OppholdskravVurderingDto =
  components['schemas']['no.nav.aap.behandlingsflyt.behandling.oppholdskrav.OppholdskravVurderingDto'];

export type Inntekt = components['schemas']['no.nav.aap.behandlingsflyt.behandling.beregning.InntektDTO'];
export type UføreInntekt = components['schemas']['no.nav.aap.behandlingsflyt.behandling.beregning.UføreInntektDTO'];

export type SettPåVent = components['schemas']['no.nav.aap.behandlingsflyt.flyt.SettPåVentRequest'];
export type SettPåVentÅrsaker = components['schemas']['no.nav.aap.behandlingsflyt.flyt.SettPåVentRequest']['grunn'];

export type TilbakekrevingVenteÅrsaker =
  components['schemas']['no.nav.aap.behandlingsflyt.kontrakt.hendelse.dokumenter.TilbakekrevingVenterKafkaDto']['grunn'];

export type VenteInformasjon = components['schemas']['no.nav.aap.behandlingsflyt.flyt.Venteinformasjon'];

export type VilkårUtfall = components['schemas']['no.nav.aap.behandlingsflyt.flyt.VilkårsperiodeDTO']['utfall'];
export type AvslagÅrsak = components['schemas']['no.nav.aap.behandlingsflyt.flyt.VilkårsperiodeDTO']['avslagsårsak'];

export type ErStudentStatus =
  components['schemas']['no.nav.aap.behandlingsflyt.faktagrunnlag.saksbehandler.student.OppgittStudent']['erStudentStatus'];
export type SkalGjenopptaStudieStatus =
  components['schemas']['no.nav.aap.behandlingsflyt.faktagrunnlag.saksbehandler.student.OppgittStudent']['skalGjenopptaStudieStatus'];

export type IdentifisertBarn =
  components['schemas']['no.nav.aap.behandlingsflyt.behandling.barnetillegg.IdentifiserteBarnDto'];

export type Ident = components['schemas']['no.nav.aap.behandlingsflyt.sakogbehandling.Ident'];

export type Periode = components['schemas']['no.nav.aap.komponenter.type.Periode'];

export type BehandlingPersoninfo = components['schemas']['no.nav.aap.behandlingsflyt.flyt.BehandlingPersoninfo'];

export type AvklaringsbehovKode =
  components['schemas']['no.nav.aap.behandlingsflyt.behandling.avklaringsbehov.løser.vedtak.TotrinnsVurdering']['definisjon'];

export type MarkeringDto = components['schemas']['no.nav.aap.oppgave.markering.MarkeringDto'];

export type Markeringstype = components['schemas']['no.nav.aap.oppgave.markering.MarkeringDto']['markeringType'];

export type BehandlingsFlytAvklaringsbehovKode =
  components['schemas']['no.nav.aap.behandlingsflyt.kontrakt.avklaringsbehov.Definisjon']['kode'];

export type LegeerklæringStatus =
  components['schemas']['no.nav.aap.dokumentinnhenting.kontrakt.DialogmeldingStatusTilBehandslingsflytDto'];
export type FastlegeResponse =
  components['schemas']['no.nav.aap.behandlingsflyt.behandling.behandlerdialog.FastlegeResponse'];
export type YrkesskadeVurderingGrunnlag =
  components['schemas']['no.nav.aap.behandlingsflyt.behandling.beregning.grunnlag.sykdom.sykdom.YrkesskadeVurderingGrunnlagResponse'];

export type ManuellInntektGrunnlag =
  components['schemas']['no.nav.aap.behandlingsflyt.behandling.beregning.manuellinntekt.ManuellInntektGrunnlagResponse'];

export type ManuellInntektÅr =
  components['schemas']['no.nav.aap.behandlingsflyt.behandling.beregning.manuellinntekt.\u00C5rData'];

export type DelperiodeData =
  components['schemas']['no.nav.aap.behandlingsflyt.behandling.beregning.manuellinntekt.MånedsperiodeData'];

export type RegistrerYrkesskade =
  components['schemas']['no.nav.aap.behandlingsflyt.faktagrunnlag.saksbehandler.sykdom.flate.RegistrertYrkesskade'];

export type YrkeskadeBeregningGrunnlag =
  components['schemas']['no.nav.aap.behandlingsflyt.behandling.beregning.tidspunkt.BeregningYrkesskadeAvklaringResponse'];
export type YrkesskadeBeløpVurderingResponse =
  components['schemas']['no.nav.aap.behandlingsflyt.behandling.beregning.tidspunkt.YrkesskadeBel\u00F8pVurderingResponse'];

export type InntektsbortfallResponse =
  paths['/api/behandling/{referanse}/grunnlag/inntektsbortfall']['get']['responses']['200']['content']['application/json'];

export type BestillLegeerklæring =
  components['schemas']['no.nav.aap.behandlingsflyt.behandling.behandlerdialog.BestillLegeerklæringDto'];

export type ForhåndsvisDialogmelding =
  components['schemas']['no.nav.aap.behandlingsflyt.behandling.behandlerdialog.ForhåndsvisBrevRequest'];

export type ForhåndsvisDialogmeldingResponse =
  components['schemas']['no.nav.aap.dokumentinnhenting.kontrakt.DialogmeldingForhåndsvisningDto'];

export type UnderveisGrunnlag =
  components['schemas']['no.nav.aap.behandlingsflyt.behandling.underveis.UnderveisperiodeDto'];

export type UnderveisGrunnlagMedDiff = Omit<
  components['schemas']['no.nav.aap.behandlingsflyt.behandling.underveis.UnderveisGrunnlagMedDiffDto'],
  'perioder'
> & {
  perioder: Diff<UnderveisGrunnlag>[];
};

export type VedtakslengdeGrunnlag =
  components['schemas']['no.nav.aap.behandlingsflyt.behandling.vedtakslengde.VedtakslengdeGrunnlagResponse'];

export type VedtakslengdeVurderingResponse =
  components['schemas']['no.nav.aap.behandlingsflyt.behandling.vedtakslengde.VedtakslengdeVurderingResponse'];

export type VedtakslengdeVurderingDto =
  components['schemas']['no.nav.aap.behandlingsflyt.faktagrunnlag.saksbehandler.vedtakslengde.VedtakslengdeVurderingDto'];

export type ForeslåVedtakGrunnlag =
  components['schemas']['no.nav.aap.behandlingsflyt.behandling.foreslåvedtak.ForeslåVedtakResponse'];

export type ForeslåVedtakVedtakslengdeGrunnlag =
  components['schemas']['no.nav.aap.behandlingsflyt.behandling.foreslåvedtak.ForeslåvedtakVedtakslengdeRespons'];

export type UnderveisAvslagsÅrsak = NonNullable<UnderveisGrunnlag['avslagsårsak']>;

export type AutomatiskLovvalgOgMedlemskapVurdering =
  components['schemas']['no.nav.aap.behandlingsflyt.behandling.vilk\u00E5r.medlemskap.KanBehandlesAutomatiskVurdering'];

export type tilhørighetVurdering =
  components['schemas']['no.nav.aap.behandlingsflyt.behandling.vilk\u00E5r.medlemskap.Tilh\u00F8righetVurdering'];

export type VisuellTidslinjeArbeidInntekt =
  components['schemas']['no.nav.aap.behandlingsflyt.behandling.vilk\u00E5r.medlemskap.VisuellTidslinjeArbeidInntektINorge'];

export type AvklarPeriodisertStudentLøsning =
  components['schemas']['no.nav.aap.behandlingsflyt.faktagrunnlag.saksbehandler.student.PeriodisertStudentDto'];

export type StudentVurderingResponse =
  components['schemas']['no.nav.aap.behandlingsflyt.behandling.student.StudentVurderingResponse'];

export type AvklarPeriodisertLovvalgMedlemskapLøsning =
  components['schemas']['no.nav.aap.behandlingsflyt.faktagrunnlag.lovvalgmedlemskap.PeriodisertManuellVurderingForLovvalgMedlemskapDto'];

export type PeriodisertLovvalgMedlemskapGrunnlag =
  components['schemas']['no.nav.aap.behandlingsflyt.behandling.lovvalgmedlemskap.grunnlag.PeriodisertLovvalgMedlemskapGrunnlagResponse'];

export type PeriodisertManuellVurderingForLovvalgMedlemskapResponse =
  components['schemas']['no.nav.aap.behandlingsflyt.behandling.lovvalgmedlemskap.grunnlag.PeriodisertManuellVurderingForLovvalgMedlemskapResponse'];

export type AvklarPeriodisertForutgåendeMedlemskapLøsning =
  components['schemas']['no.nav.aap.behandlingsflyt.faktagrunnlag.lovvalgmedlemskap.PeriodisertManuellVurderingForForutgåendeMedlemskapDto'];

export type PeriodisertForutgåendeMedlemskapGrunnlag =
  components['schemas']['no.nav.aap.behandlingsflyt.behandling.lovvalgmedlemskap.grunnlag.PeriodisertForutgåendeMedlemskapGrunnlagResponse'];

export type PeriodisertManuellVurderingForForutgåendeMedlemskapResponse =
  components['schemas']['no.nav.aap.behandlingsflyt.behandling.lovvalgmedlemskap.grunnlag.PeriodisertManuellVurderingForForutgåendeMedlemskapResponse'];

export type EtableringEgenVirksomhetGrunnlagResponse =
  components['schemas']['no.nav.aap.behandlingsflyt.behandling.etableringegenvirksomhet.EtableringEgenVirksomhetGrunnlagResponse'];

export type EtableringEgenVirksomhetVurderingResponse =
  components['schemas']['no.nav.aap.behandlingsflyt.behandling.etableringegenvirksomhet.EtableringEgenVirksomhetVurderingResponse'];

export type EtableringEgenVirksomhetLøsningDto =
  components['schemas']['no.nav.aap.behandlingsflyt.faktagrunnlag.saksbehandler.etableringegenvirksomhet.EtableringEgenVirksomhetLøsningDto'];

export type EtableringEierBrukerVirksomheten = EtableringEgenVirksomhetLøsningDto['brukerEierVirksomheten'];

export type SykdomBrevVurdering =
  components['schemas']['no.nav.aap.behandlingsflyt.behandling.brev.SykdomsvurderingForBrevVurderingDto'];

export type LovvalgEØSLand =
  components['schemas']['no.nav.aap.behandlingsflyt.faktagrunnlag.lovvalgmedlemskap.LovvalgDto']['lovvalgsEØSLandEllerLandMedAvtale'];

export type SykdomsvurderingResponse =
  components['schemas']['no.nav.aap.behandlingsflyt.behandling.beregning.grunnlag.sykdom.sykdom.SykdomsvurderingResponse'];

export type VurdertAvAnsatt =
  components['schemas']['no.nav.aap.behandlingsflyt.behandling.vurdering.VurdertAvResponse'];

export type ArbeidsevneNedsattValg =
  components['schemas']['no.nav.aap.behandlingsflyt.behandling.beregning.grunnlag.sykdom.sykdom.SykdomsvurderingResponse']['harNedsattArbeidsevne'];

export type BistandsbehovVurdering =
  components['schemas']['no.nav.aap.behandlingsflyt.behandling.beregning.grunnlag.sykdom.bistand.BistandVurderingResponse'];

export type BistandsbehovLøsning =
  components['schemas']['no.nav.aap.behandlingsflyt.faktagrunnlag.saksbehandler.bistand.flate.BistandL\u00F8sningDto'];

export type OvergangUføreVurdering =
  components['schemas']['no.nav.aap.behandlingsflyt.behandling.beregning.grunnlag.sykdom.overgangufore.OvergangUføreVurderingResponse'];

export type OvergangUføreVedtakResultat =
  components['schemas']['no.nav.aap.behandlingsflyt.behandling.beregning.grunnlag.sykdom.overgangufore.OvergangUføreVurderingResponse']['brukerHarFåttVedtakOmUføretrygd'];

export type OvergangArbeidVurdering =
  components['schemas']['no.nav.aap.behandlingsflyt.behandling.beregning.grunnlag.sykdom.overgangarbeid.OvergangArbeidVurderingResponse'];

export type OvergangArbeidLøsning =
  components['schemas']['no.nav.aap.behandlingsflyt.faktagrunnlag.saksbehandler.overgangarbeid.flate.OvergangArbeidVurderingLøsningDto'];

export type NavEnhetRequest =
  components['schemas']['no.nav.aap.behandlingsflyt.behandling.beregning.grunnlag.refusjon.NavEnheterRequest'];

export type NavEnheterResponse =
  components['schemas']['no.nav.aap.behandlingsflyt.behandling.beregning.grunnlag.refusjon.NavEnheterResponse'];

export type OppholdskravGrunnlagResponse =
  components['schemas']['no.nav.aap.behandlingsflyt.behandling.oppholdskrav.OppholdskravGrunnlagResponse'];

export type Søknad = components['schemas']['no.nav.aap.behandlingsflyt.kontrakt.hendelse.dokumenter.S\u00F8knadV0'];

export const MeldekortV0 = 'MeldekortV0';
export type MeldekortV0 =
  components['schemas'][`no.nav.aap.behandlingsflyt.kontrakt.hendelse.dokumenter.${typeof MeldekortV0}`] & {
    meldingType: typeof MeldekortV0 /* Hadde vært fint om dette kom med i kontrakten ... */;
  };

export const KlageV0 = 'KlageV0';
export type KlageV0 =
  components['schemas'][`no.nav.aap.behandlingsflyt.kontrakt.hendelse.dokumenter.${typeof KlageV0}`] & {
    meldingType: typeof KlageV0 /* Hadde vært fint om dette kom med i kontrakten ... */;
  };

export type AnnetRelevantDokument =
  components['schemas'][`no.nav.aap.behandlingsflyt.kontrakt.hendelse.dokumenter.AnnetRelevantDokument`] & {
    meldingType: 'AnnetRelevantDokumentV1' /* Hadde vært fint om dette kom med i kontrakten ... */;
  };

export type AnnetRelevantDokumentUnderkategori =
  components['schemas'][`no.nav.aap.behandlingsflyt.kontrakt.hendelse.dokumenter.AnnetRelevantDokument`]['underkategori'];

export const ManuellRevurderingV0 = 'ManuellRevurderingV0';
export type ManuellRevurderingV0 =
  components['schemas'][`no.nav.aap.behandlingsflyt.kontrakt.hendelse.dokumenter.${typeof ManuellRevurderingV0}`] & {
    meldingType: typeof ManuellRevurderingV0 /* Hadde vært fint om dette kom med i kontrakten ... */;
  };

export const NyÅrsakTilBehandlingV0 = 'NyÅrsakTilBehandlingV0';
export type NyÅrsakTilBehandlingV0 =
  components['schemas'][`no.nav.aap.behandlingsflyt.kontrakt.hendelse.dokumenter.${typeof NyÅrsakTilBehandlingV0}`] & {
    meldingType: typeof NyÅrsakTilBehandlingV0 /* Hadde vært fint om dette kom med i kontrakten ... */;
  };

export type AvklarOppfolgingsoppgaveGrunnlagResponse =
  components['schemas']['no.nav.aap.behandlingsflyt.behandling.oppfolgingsbehandling.AvklarOppfolgingsoppgaveGrunnlagResponse'];

export const OppfølgingoppgaveV0 = 'OppfølgingsoppgaveV0';

export type OppfølgingsoppgaveV0 =
  components['schemas']['no.nav.aap.behandlingsflyt.kontrakt.hendelse.dokumenter.Oppf\u00F8lgingsoppgaveV0'] & {
    meldingType: typeof OppfølgingoppgaveV0 /* Hadde vært fint om dette kom med i kontrakten ... */;
  };

export type Aktivitetsplikt11_7Grunnlag =
  components['schemas']['no.nav.aap.behandlingsflyt.behandling.aktivitetsplikt.brudd_11_7.Aktivitetsplikt11_7GrunnlagDto'];

export type Aktivitetsplikt11_9Grunnlag =
  components['schemas']['no.nav.aap.behandlingsflyt.behandling.aktivitetsplikt.brudd_11_9.Aktivitetsplikt11_9GrunnlagDto'];

export type Aktivitetsplikt11_9Løsning =
  components['schemas']['no.nav.aap.behandlingsflyt.faktagrunnlag.aktivitetsplikt.Aktivitetsplikt11_9L\u00F8sningDto'];

export type AktivitetspliktMedTrekkRespons =
  components['schemas']['no.nav.aap.behandlingsflyt.behandling.aktivitetsplikt.brudd_11_9.AktivitetspliktMedTrekkDto'];

export type Brudd =
  components['schemas']['no.nav.aap.behandlingsflyt.faktagrunnlag.aktivitetsplikt.Aktivitetsplikt11_9L\u00F8sningDto']['brudd'];

export type Aktivitetsplikt11_7Vurdering =
  components['schemas']['no.nav.aap.behandlingsflyt.behandling.aktivitetsplikt.brudd_11_7.Aktivitetsplikt11_7VurderingDto'];

export type OpprettAktivitetspliktBehandlingDto =
  components['schemas']['no.nav.aap.behandlingsflyt.sakogbehandling.sak.flate.OpprettAktivitetspliktBehandlingDto'];

export type DokumentÅrsakTilBehandling = AnnetRelevantDokument['årsakerTilBehandling'][number];

export type BehandlingInfo =
  components['schemas']['no.nav.aap.behandlingsflyt.sakogbehandling.sak.flate.BehandlinginfoDTO'];

export type Vurderingsbehov =
  components['schemas'][`no.nav.aap.behandlingsflyt.kontrakt.hendelse.dokumenter.Ny\u00C5rsakTilBehandling`]['årsakerTilBehandling'][number];

export type StansOpphørÅrsak =
  components['schemas']['no.nav.aap.behandlingsflyt.behandling.foreslåvedtak.StansOpphørVurderingDto']['årsaker'][number];

/**
 * @deprecated Unngå denne i frontend. Får ikke fjernet den helt ennå fordi noen av løserne forventer denne. Men alt av dokumenter
 * til behandlingsflyt forventer `Vurderingsbehov`.
 */
export type VurderingsbehovIntern =
  components['schemas'][`no.nav.aap.behandlingsflyt.sakogbehandling.sak.flate.BehandlinginfoDTO`]['vurderingsbehov'][number];

export type VurderingsbehovMedPeriode =
  components['schemas']['no.nav.aap.behandlingsflyt.sakogbehandling.behandling.VurderingsbehovMedPeriode'];

export type ÅrsakTilOpprettelse =
  components['schemas'][`no.nav.aap.behandlingsflyt.sakogbehandling.sak.flate.BehandlinginfoDTO`]['årsakTilOpprettelse'];

export type VurderingsbehovOgÅrsak =
  components['schemas']['no.nav.aap.behandlingsflyt.sakogbehandling.behandling.VurderingsbehovOgÅrsak'];

// oppgave
export type Oppgave = oppgave['schemas']['no.nav.aap.oppgave.OppgaveDto'];

export type ReturStatus = NonNullable<Oppgave['returInformasjon']>['status'];

export type Behandlingsstatus = DetaljertBehandling['status'];

// Mellomlagring

export type MellomlagretVurderingResponse =
  components['schemas']['no.nav.aap.behandlingsflyt.behandling.mellomlagring.MellomlagretVurderingResponse'];
export type MellomlagretVurderingRequest =
  components['schemas']['no.nav.aap.behandlingsflyt.behandling.mellomlagring.MellomlagretVurderingRequest'];
export type MellomlagretVurdering =
  components['schemas']['no.nav.aap.behandlingsflyt.behandling.mellomlagring.MellomlagretVurderingDto'];

export type OppfølgningOppgaveOpprinnelseResponse =
  components['schemas']['no.nav.aap.behandlingsflyt.behandling.oppfolgingsbehandling.OppfølgningOppgaveOpprinnelseResponse'];

export type ArbeidsopptrappingGrunnlagResponse =
  components['schemas']['no.nav.aap.behandlingsflyt.behandling.arbeidsopptrapping.ArbeidsopptrappingGrunnlagResponse'];

export type ArbeidsopptrappingLøsningDto =
  components['schemas']['no.nav.aap.behandlingsflyt.faktagrunnlag.saksbehandler.arbeidsopptrapping.ArbeidsopptrappingL\u00F8sningDto'];

export type ForeløpigBehandlingsutfall =
  components['schemas']['no.nav.aap.behandlingsflyt.behandling.tidligerevurderinger.TidligereVurderingerDto'];

export type MeldePerioderMedMEldekortResponse =
  components['schemas']['no.nav.aap.behandlingsflyt.behandling.meldekort.MeldeperioderMedMeldekortResponse'];

export type MeldeperiodeMedMeldekortDto =
  components['schemas']['no.nav.aap.behandlingsflyt.behandling.meldekort.MeldeperiodeMedMeldekortDto'];

export type MeldepliktStatuser =
  components['schemas']['no.nav.aap.behandlingsflyt.behandling.meldekort.MeldeperiodeMedMeldekortDto']['meldepliktStatus'];

export type OppdaterMeldekortRequest =
  components['schemas']['no.nav.aap.behandlingsflyt.behandling.meldekort.OppdaterMeldekortRequest'];

export type OppdaterMeldekortResponse =
  components['schemas']['no.nav.aap.behandlingsflyt.behandling.meldekort.OppdaterMeldekortResponse'];

export type MeldekortProsesseringResponse =
  components['schemas']['no.nav.aap.behandlingsflyt.behandling.meldekort.MeldekortProsesseringResponse'];

export type MeldekortProsesseringStatus =
  components['schemas']['no.nav.aap.behandlingsflyt.behandling.meldekort.MeldekortProsesseringResponse']['meldekortProsesseringStatus'];

export type DagDto = components['schemas']['no.nav.aap.behandlingsflyt.behandling.meldekort.DagDto'];

export type BrevdataDto = components['schemas']['no.nav.aap.brev.kontrakt.BrevdataDto'];
export type DelmalDto = components['schemas']['no.nav.aap.brev.kontrakt.BrevdataDto.Delmal'];
export type ValgDto = components['schemas']['no.nav.aap.brev.kontrakt.BrevdataDto.Valg'];
export type FritekstDto = components['schemas']['no.nav.aap.brev.kontrakt.BrevdataDto.Fritekst'];

// ---- HENTET FRA BEHANDLINGSFLYT PeriodiserteVurderingerDto.kt ---
export interface VurderingDto {
  fom: string;
  tom?: string | null;
  vurdertAv?: VurdertAvAnsatt | null;
  kvalitetssikretAv?: VurdertAvAnsatt | null;
  besluttetAv?: VurdertAvAnsatt | null;
}

export type PeriodiserteVurderingerDto<T extends VurderingDto> = {
  harTilgangTilÅSaksbehandle: boolean;
  sisteVedtatteVurderinger: Array<T>;
  nyeVurderinger: Array<T>;
  kanVurderes: Array<Periode>;
  behøverVurderinger: Array<Periode>;
  ikkeRelevantePerioder: Array<Periode>;
};

export interface PeriodisertVurderingFormFields {
  fraDato?: string;
  tilDato?: string | null;
}

export interface VurderingFormMeta {
  behøverVurdering: boolean;
  erNyVurdering: boolean;
  vurderingerMeta?: VurderingerMeta;
}

export type VurderingerMeta =
  components['schemas']['no.nav.aap.behandlingsflyt.behandling.vurdering.VurderingerMetaResponse'] & {
    vurdertAutomatisk?: boolean;
    trukketAv?: VurdertAvAnsatt;
  };

// Gjør at vi kan lage et typesikkert "enum-objekt" med union types generert fra backend. feks const minEnum = lagEnumObjektFraUnionType<StegGruppe>({ SYKDOM: 'SYKDOM' ...})
export function lagEnumObjektFraUnionType<UnionType extends string>(o: { [P in UnionType]: P }): {
  [P in UnionType]: P;
} {
  return o;
}

export enum Roller {
  BESLUTTER = 'Beslutter',
  LES = 'Les',
  SAKSBEHANDLER_OPPFØLGING = 'Veileder',
  KVALITETSSIKRER = 'Kvalitetssikrer',
  SAKSBEHANDLER_NASJONAL = 'Saksbehandler',
  DRIFT = 'Drift',
  PRODUKSJONSSTYRING = 'Produksjonsstyring',
}

export interface UmamiKelvinEvent {
  name: string;
  hendelse?: string;
  hendelser_serie: string | null;
  hendelser_serie_id: string | null;
  tidsstempel: number | null;
  varighet_sekunder: number | null;
  varighet_sekunder_siden_forrige: number | null;
  brevtype: string | null;
}
export type UmamiTag =
  | 'STEG_TREKK_SØKNAD_VARIGHET'
  | 'STEG_RETTIGHETSPERIODE_VARIGHET'
  | 'STEG_LOVVALG_MEDLEMSKAP_VARIGHET'
  | 'STEG_STUDENT_VARIGHET'
  | 'STEG_YRKESSKADE_VARIGHET'
  | 'STEG_SYKEPENGEERSTATNING_VARIGHET'
  | 'STEG_FASTSETT_BEREGNINGSTIDSPUNKT_VARIGHET'
  | 'STEG_YRKESSKADE_GRUNNLAGSBEREGNING_VARIGHET'
  | 'STEG_MANGLENDE_LIGNING_VARIGHET'
  | 'STEG_INNTEKTSBORTFALL_VARIGHET'
  | 'STEG_FORUTGÅENDE_MEDLEMSKAP_VARIGHET'
  | 'STEG_OPPHOLDSKRAV_VARIGHET'
  | 'STEG_BARNETILLEGG_VARIGHET'
  | 'STEG_INSTITUSJON_VARIGHET'
  | 'STEG_SONINGSFORHOLD_VARIGHET'
  | 'STEG_SAMORDNING_GRADERING_VARIGHET'
  | 'STEG_SAMORDNING_UFØRE_VARIGHET'
  | 'STEG_SAMORDNING_TJENESTEPENSJON_VARIGHET'
  | 'STEG_SAMORDNING_ARBEIDSGIVER_VARIGHET'
  | 'STEG_BARNEPENSJON_VARIGHET'
  | 'STEG_SYKESTIPEND_VARIGHET'
  | 'STEG_SAMORDNING_ANDRE_STATLIGE_YTELSER_VARIGHET'
  | 'STEG_VEDTAKSLENGDE_VARIGHET'
  | 'STEG_FORESLÅ_VEDTAK_VEDTAKSLENGDE_VARIGHET'
  | 'STEG_IKKEOPPFYLT_MELDEPLIKT_VARIGHET'
  | 'STEG_UNDERVEIS_VARIGHET'
  | 'STEG_FORESLÅ_VEDTAK_VARIGHET'
  | 'STEG_BESLUTTER_VARIGHET'
  | 'STEG_KVALITETSSIKRER_VARIGHET'
  | 'STEG_AVBRYT_REVURDERING_VARIGHET'
  | 'STEG_SVAR_FRA_ANDREINSTANS_VARIGHET'
  | 'STEG_BREVBYGGER_VARIGHET'
  | 'STEG_SKRIVBREV_VARIGHET'
  | 'LOVVALG_MEDLEMSKAP_VARIGHET_HENDELSER'
  | 'LOVVALG_MEDLEMSKAP_INPUT_FRA_DATO'
  | 'LOVVALG_MEDLEMSKAP_INPUT_LOVVALG_BEGRUNNELSE'
  | 'LOVVALG_MEDLEMSKAP_INPUT_LOVVALGSLAND_EØS'
  | 'LOVVALG_MEDLEMSKAP_INPUT_LOVVALGSLAND_ANNET'
  | 'LOVVALG_MEDLEMSKAP_INPUT_MEDLEMSKAP_BEGRUNNELSE'
  | 'LOVVALG_MEDLEMSKAP_INPUT_MEDLEMSKAP_I_FOLKETRYGDEN'
  | 'BESLUTTER_VARIGHET_HENDELSER'
  | 'KVALITETSSIKRER_VARIGHET_HENDELSER';
