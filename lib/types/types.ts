import { components } from './schema';
import { components as oppgave } from '@navikt/aap-oppgave-typescript-types';

// Grunnlag
export type StudentGrunnlag =
  components['schemas']['no.nav.aap.behandlingsflyt.behandling.student.StudentGrunnlagResponse'];
export type SykdomsGrunnlag =
  components['schemas']['no.nav.aap.behandlingsflyt.behandling.beregning.grunnlag.sykdom.sykdom.SykdomGrunnlagResponse'];
export type SykdomsvurderingBrevGrunnlag =
  components['schemas']['no.nav.aap.behandlingsflyt.behandling.brev.SykdomsvurderingForBrevDto'];
export type SykepengeerstatningGrunnlag =
  components['schemas']['no.nav.aap.behandlingsflyt.behandling.beregning.grunnlag.sykdom.sykepengergrunnlag.SykepengerGrunnlagResponse'];

export type SykepengeerstatningVurderingGrunn =
  components['schemas']['no.nav.aap.behandlingsflyt.faktagrunnlag.saksbehandler.sykdom.flate.SykepengerVurderingDto']['grunn'];
export type BistandsGrunnlag =
  components['schemas']['no.nav.aap.behandlingsflyt.behandling.beregning.grunnlag.sykdom.bistand.BistandGrunnlagResponse'];
export type FritakMeldepliktGrunnlag =
  components['schemas']['no.nav.aap.behandlingsflyt.behandling.beregning.grunnlag.fritakmeldeplikt.FritakMeldepliktGrunnlagResponse'];
export type RimeligGrunnMeldepliktGrunnlag =
  components['schemas']['no.nav.aap.behandlingsflyt.behandling.underveis.MeldepliktRimeligGrunnGrunnlagResponse'];
export type ArbeidsevneGrunnlag =
  components['schemas']['no.nav.aap.behandlingsflyt.behandling.arbeidsevne.ArbeidsevneGrunnlagDto'];
export type RefusjonskravGrunnlag =
  components['schemas']['no.nav.aap.behandlingsflyt.behandling.beregning.grunnlag.refusjon.RefusjonkravGrunnlagResponse'];

export type BeregningTidspunktGrunnlag =
  components['schemas']['no.nav.aap.behandlingsflyt.behandling.beregning.tidspunkt.BeregningTidspunktAvklaringResponse'];

export type TilkjentYtelseGrunnlag =
  components['schemas']['no.nav.aap.behandlingsflyt.behandling.tilkjentytelse.TilkjentYtelse2Dto'];

export type KvalitetssikringGrunnlag =
  components['schemas']['no.nav.aap.behandlingsflyt.behandling.kvalitetssikring.KvalitetssikringGrunnlagDto'];
export type KvalitetssikringTilgang =
  components['schemas']['no.nav.aap.behandlingsflyt.behandling.kvalitetssikring.KvalitetssikringTilgangDto'];
export type BarnetilleggGrunnlag =
  components['schemas']['no.nav.aap.behandlingsflyt.behandling.barnetillegg.BarnetilleggDto'];
export type Soningsgrunnlag =
  components['schemas']['no.nav.aap.behandlingsflyt.behandling.etannetsted.SoningsGrunnlagDto'];
export type HelseinstitusjonGrunnlag =
  components['schemas']['no.nav.aap.behandlingsflyt.behandling.etannetsted.HelseinstitusjonGrunnlagDto'];
export type Institusjonsopphold =
  components['schemas']['no.nav.aap.behandlingsflyt.behandling.etannetsted.InstitusjonsoppholdDto'];

export type FatteVedtakGrunnlag =
  components['schemas']['no.nav.aap.behandlingsflyt.behandling.avklaringsbehov.FatteVedtakGrunnlagDto'];

export type AlderGrunnlag =
  components['schemas']['no.nav.aap.behandlingsflyt.behandling.beregning.grunnlag.alder.AlderDTO'];

export type BrevGrunnlag = components['schemas']['no.nav.aap.behandlingsflyt.behandling.brev.BrevGrunnlag'];
export type BrevGrunnlagBrev = components['schemas']['no.nav.aap.behandlingsflyt.behandling.brev.BrevGrunnlag.Brev'];
export type Brev = components['schemas']['no.nav.aap.brev.kontrakt.Brev'];
export type BrevStatus =
  components['schemas']['no.nav.aap.behandlingsflyt.behandling.brev.BrevGrunnlag.Brev']['status'];
export type BrevMottaker =
  components['schemas']['no.nav.aap.behandlingsflyt.behandling.brev.BrevGrunnlag.Brev.Mottaker'];
export type Signatur = components['schemas']['no.nav.aap.brev.kontrakt.Signatur'];
export type Mottaker =
  components['schemas']['no.nav.aap.behandlingsflyt.behandling.avklaringsbehov.løsning.SkrivBrevLøsning']['mottakere'][number];
export type SamordningTjenestePensjonGrunnlag =
  components['schemas']['no.nav.aap.behandlingsflyt.behandling.grunnlag.samordning.TjenestepensjonGrunnlagDTO'];
export type SamordningGraderingGrunnlag =
  components['schemas']['no.nav.aap.behandlingsflyt.behandling.grunnlag.samordning.SamordningYtelseVurderingGrunnlagDTO'];
export type SamordningGraderingYtelse =
  components['schemas']['no.nav.aap.behandlingsflyt.behandling.grunnlag.samordning.SamordningYtelseDTO'];
export type SamordningYtelsestype =
  components['schemas']['no.nav.aap.behandlingsflyt.behandling.grunnlag.samordning.SamordningYtelseDTO']['ytelseType'];
export type SamordningUføreGrunnlag =
  components['schemas']['no.nav.aap.behandlingsflyt.behandling.grunnlag.samordning.SamordningUføreVurderingGrunnlagDTO'];
export type SamordningAndreStatligeYtelserGrunnlag =
  components['schemas']['no.nav.aap.behandlingsflyt.behandling.grunnlag.samordning.SamordningAndreStatligeYtelserGrunnlagDTO'];
export type SamordningArbeidsgiverGrunnlag =
  components['schemas']['no.nav.aap.behandlingsflyt.behandling.grunnlag.samordning.SamordningArbeidsgiverGrunnlagDTO'];

export type SamordningAndreStatligeYtelserYtelse =
  components['schemas']['no.nav.aap.behandlingsflyt.faktagrunnlag.delvurdering.samordning.andrestatligeytelservurdering.SamordningAndreStatligeYtelserVurderingPeriodeDto']['ytelse'];

export type TrukketSøknadGrunnlag =
  components['schemas']['no.nav.aap.behandlingsflyt.behandling.søknad.TrukketSøknadGrunnlagDto'];
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
export type BehandlingFlytOgTilstand =
  components['schemas']['no.nav.aap.behandlingsflyt.flyt.BehandlingFlytOgTilstandDto'];
export type FlytGruppe = components['schemas']['no.nav.aap.behandlingsflyt.flyt.FlytGruppe'];
export type FlytVisning = components['schemas']['no.nav.aap.behandlingsflyt.flyt.flate.visning.Visning'];
export type TypeBehandling =
  components['schemas']['no.nav.aap.behandlingsflyt.flyt.flate.visning.Visning']['typeBehandling'];

export type LøsAvklaringsbehovPåBehandling =
  components['schemas']['no.nav.aap.behandlingsflyt.behandling.avklaringsbehov.flate.LøsAvklaringsbehovPåBehandling'];
// Sak
export type SaksInfo = components['schemas']['no.nav.aap.behandlingsflyt.sakogbehandling.sak.flate.UtvidetSaksinfoDTO'];
export type SakPersoninfo =
  components['schemas']['no.nav.aap.behandlingsflyt.sakogbehandling.sak.flate.SakPersoninfoDTO'];

export type OpprettTestcase = components['schemas']['no.nav.aap.behandlingsflyt.OpprettTestcaseDTO'];
export type OpprettDummySakDto = components['schemas']['no.nav.aap.behandlingsflyt.test.OpprettDummySakDto'];
export type FinnSakForIdent =
  components['schemas']['no.nav.aap.behandlingsflyt.sakogbehandling.sak.flate.FinnSakForIdentDTO'];

export type Vilkår = components['schemas']['no.nav.aap.behandlingsflyt.flyt.VilkårDTO'];

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

export type Inntekt = components['schemas']['no.nav.aap.behandlingsflyt.behandling.beregning.InntektDTO'];
export type UføreInntekt = components['schemas']['no.nav.aap.behandlingsflyt.behandling.beregning.UføreInntektDTO'];

export type SettPåVent = components['schemas']['no.nav.aap.behandlingsflyt.flyt.SettPåVentRequest'];
export type SettPåVentÅrsaker = components['schemas']['no.nav.aap.behandlingsflyt.flyt.SettPåVentRequest']['grunn'];

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

export type AktivitetspliktHendelse =
  components['schemas']['no.nav.aap.behandlingsflyt.behandling.bruddaktivitetsplikt.BruddAktivitetspliktHendelseDto'];

export type OpprettAktivitetspliktBrudd =
  components['schemas']['no.nav.aap.behandlingsflyt.behandling.bruddaktivitetsplikt.OpprettAktivitetspliktDTO'];

export type OppdaterAktivitetspliktBrudd2 =
  components['schemas']['no.nav.aap.behandlingsflyt.behandling.bruddaktivitetsplikt.OppdaterAktivitetspliktDTOV2'];

export type OppdaterAktivitetsplitGrunn =
  components['schemas']['no.nav.aap.behandlingsflyt.behandling.bruddaktivitetsplikt.OppdaterAktivitetspliktDTOV2']['grunn'];

export type AktivitetspliktHendelser =
  components['schemas']['no.nav.aap.behandlingsflyt.behandling.bruddaktivitetsplikt.BruddAktivitetspliktResponse'];

export type AktivitetspliktParagraf =
  components['schemas']['no.nav.aap.behandlingsflyt.behandling.bruddaktivitetsplikt.OpprettAktivitetspliktDTO']['paragraf'];

export type AktivitetspliktGrunn =
  components['schemas']['no.nav.aap.behandlingsflyt.behandling.bruddaktivitetsplikt.BruddAktivitetspliktHendelseDto']['grunn'];

export type AktivitetspliktBrudd =
  components['schemas']['no.nav.aap.behandlingsflyt.behandling.bruddaktivitetsplikt.OpprettAktivitetspliktDTO']['brudd'];

export type AktivitetspliktHendelseParagraf =
  components['schemas']['no.nav.aap.behandlingsflyt.behandling.bruddaktivitetsplikt.BruddAktivitetspliktHendelseDto']['paragraf'];

export type Periode = components['schemas']['no.nav.aap.komponenter.type.Periode'];
export type ÅpenPeriode = components['schemas']['no.nav.aap.behandlingsflyt.historiskevurderinger.ÅpenPeriodeDto'];
export type AktivitetspliktPeriode =
  components['schemas']['no.nav.aap.behandlingsflyt.behandling.bruddaktivitetsplikt.PeriodeDTO'];

export type BehandlingPersoninfo = components['schemas']['no.nav.aap.behandlingsflyt.flyt.BehandlingPersoninfo'];

export type AvklaringsbehovKode =
  components['schemas']['no.nav.aap.behandlingsflyt.behandling.avklaringsbehov.løser.vedtak.TotrinnsVurdering']['definisjon'];

export type BehandlingsFlytAvklaringsbehovKode =
  components['schemas']['no.nav.aap.behandlingsflyt.kontrakt.avklaringsbehov.Definisjon']['kode'];

export type LegeerklæringStatus =
  components['schemas']['no.nav.aap.behandlingsflyt.faktagrunnlag.dokument.dokumentinnhenting.LegeerklæringStatusResponse'];

export type YrkesskadeVurderingGrunnlag =
  components['schemas']['no.nav.aap.behandlingsflyt.behandling.beregning.grunnlag.sykdom.sykdom.YrkesskadeVurderingGrunnlagResponse'];

export type ManuellInntektGrunnlag =
  components['schemas']['no.nav.aap.behandlingsflyt.behandling.beregning.manuellinntekt.ManuellInntektGrunnlagResponse'];

export type RegistrerYrkesskade =
  components['schemas']['no.nav.aap.behandlingsflyt.faktagrunnlag.saksbehandler.sykdom.flate.RegistrertYrkesskade'];

export type YrkeskadeBeregningGrunnlag =
  components['schemas']['no.nav.aap.behandlingsflyt.behandling.beregning.tidspunkt.BeregningYrkesskadeAvklaringResponse'];

export type BestillLegeerklæring =
  components['schemas']['no.nav.aap.behandlingsflyt.behandling.dokumentinnhenting.BestillLegeerklæringDto'];

export type ForhåndsvisDialogmelding =
  components['schemas']['no.nav.aap.behandlingsflyt.behandling.dokumentinnhenting.Forh\u00E5ndsvisBrevRequest'];

export type ForhåndsvisDialogmeldingResponse =
  components['schemas']['no.nav.aap.behandlingsflyt.faktagrunnlag.dokument.dokumentinnhenting.BrevResponse'];

export type UnderveisGrunnlag =
  components['schemas']['no.nav.aap.behandlingsflyt.behandling.underveis.UnderveisperiodeDto'];

export type UnderveisAvslagsÅrsak = NonNullable<UnderveisGrunnlag['avslagsårsak']>;

export type AktivitetspliktGrunnlag =
  components['schemas']['no.nav.aap.behandlingsflyt.behandling.bruddaktivitetsplikt.Effektuer11_7Dto'];

export type AutomatiskLovvalgOgMedlemskapVurdering =
  components['schemas']['no.nav.aap.behandlingsflyt.behandling.vilk\u00E5r.medlemskap.KanBehandlesAutomatiskVurdering'];

export type tilhørighetVurdering =
  components['schemas']['no.nav.aap.behandlingsflyt.behandling.vilk\u00E5r.medlemskap.Tilh\u00F8righetVurdering'];

export type LovvalgMedlemskapGrunnlag =
  components['schemas']['no.nav.aap.behandlingsflyt.behandling.lovvalgmedlemskap.grunnlag.LovvalgMedlemskapGrunnlagResponse'];

export type HistoriskLovvalgMedlemskapVurdering =
  components['schemas']['no.nav.aap.behandlingsflyt.behandling.lovvalgmedlemskap.grunnlag.HistoriskManuellVurderingForLovvalgMedlemskapResponse'];

export type ForutgåendeMedlemskapGrunnlag =
  components['schemas']['no.nav.aap.behandlingsflyt.behandling.lovvalgmedlemskap.grunnlag.ForutgåendeMedlemskapGrunnlagResponse'];

export type HistoriskForutgåendeMedlemskapVurdering =
  components['schemas']['no.nav.aap.behandlingsflyt.behandling.lovvalgmedlemskap.grunnlag.HistoriskManuellVurderingForForutgåendeMedlemskapResponse'];

export type SykdomBrevVurdering =
  components['schemas']['no.nav.aap.behandlingsflyt.behandling.brev.SykdomsvurderingForBrevVurderingDto'];

export type LovvalgEØSLand =
  components['schemas']['no.nav.aap.behandlingsflyt.faktagrunnlag.lovvalgmedlemskap.LovvalgVedSøknadsTidspunktDto']['lovvalgsEØSLand'];

export type SykdomsvurderingResponse =
  components['schemas']['no.nav.aap.behandlingsflyt.behandling.beregning.grunnlag.sykdom.sykdom.SykdomsvurderingResponse'];

export type VurdertAvAnsatt =
  components['schemas']['no.nav.aap.behandlingsflyt.behandling.vurdering.VurdertAvResponse'];

export type BistandsbehovVurdering =
  components['schemas']['no.nav.aap.behandlingsflyt.behandling.beregning.grunnlag.sykdom.bistand.BistandVurderingResponse'];

export type NavEnhetRequest =
  components['schemas']['no.nav.aap.behandlingsflyt.behandling.beregning.grunnlag.refusjon.NavEnheterRequest'];

export type NavEnheterResponse =
  components['schemas']['no.nav.aap.behandlingsflyt.behandling.beregning.grunnlag.refusjon.NavEnheterResponse'];

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

export const AnnetRelevantDokumentV0 = 'AnnetRelevantDokumentV0';
export type AnnetRelevantDokumentV0 =
  components['schemas'][`no.nav.aap.behandlingsflyt.kontrakt.hendelse.dokumenter.${typeof AnnetRelevantDokumentV0}`] & {
    meldingType: typeof AnnetRelevantDokumentV0 /* Hadde vært fint om dette kom med i kontrakten ... */;
  };

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

export type DokumentÅrsakTilBehandling = AnnetRelevantDokumentV0['årsakerTilBehandling'][number];

export type Vurderingsbehov =
  components['schemas'][`no.nav.aap.behandlingsflyt.sakogbehandling.sak.flate.BehandlinginfoDTO`]['vurderingsbehov'][number];

export type ÅrsakTilOpprettelse =
  components['schemas'][`no.nav.aap.behandlingsflyt.sakogbehandling.sak.flate.BehandlinginfoDTO`]['årsakTilOpprettelse'];

// oppgave
export type Oppgave = oppgave['schemas']['no.nav.aap.oppgave.OppgaveDto'];

export type ReturStatus = NonNullable<Oppgave['returInformasjon']>['status'];

export type Behandlingsstatus = DetaljertBehandling['status'];

// Mellomlagring

export type MellomlagredeVurderingResponse =
  components['schemas']['no.nav.aap.behandlingsflyt.behandling.mellomlagring.MellomlagredeVurderingResponse'];
export type MellomlagredeVurderingRequest =
  components['schemas']['no.nav.aap.behandlingsflyt.behandling.mellomlagring.MellomlagretVurderingRequest'];
export type MellomLagretVurdering =
  components['schemas']['no.nav.aap.behandlingsflyt.behandling.mellomlagring.MellomlagretVurderingDto'];
