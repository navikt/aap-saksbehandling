import { components } from './schema';
import { components as oppgave } from '@navikt/aap-oppgave-typescript-types';

// Grunnlag
export type StudentGrunnlag =
  components['schemas']['no.nav.aap.behandlingsflyt.behandling.student.StudentGrunnlagResponse'];
export type SykdomsGrunnlag =
  components['schemas']['no.nav.aap.behandlingsflyt.behandling.beregning.grunnlag.sykdom.sykdom.SykdomGrunnlagResponse'];
export type SykepengeerstatningGrunnlag =
  components['schemas']['no.nav.aap.behandlingsflyt.behandling.beregning.grunnlag.sykdom.sykepengergrunnlag.SykepengerGrunnlagResponse'];

export type SykepengeerstatningVurderingGrunn =
  components['schemas']['no.nav.aap.behandlingsflyt.faktagrunnlag.saksbehandler.sykdom.flate.SykepengerVurderingDto']['grunn'];
export type BistandsGrunnlag =
  components['schemas']['no.nav.aap.behandlingsflyt.behandling.beregning.grunnlag.sykdom.bistand.BistandGrunnlagResponse'];
export type FritakMeldepliktGrunnlag =
  components['schemas']['no.nav.aap.behandlingsflyt.behandling.beregning.grunnlag.fritakmeldeplikt.FritakMeldepliktGrunnlagResponse'];
export type ArbeidsevneGrunnlag =
  components['schemas']['no.nav.aap.behandlingsflyt.faktagrunnlag.saksbehandler.arbeidsevne.flate.ArbeidsevneGrunnlagDto'];
export type RefusjonskravGrunnlag =
  components['schemas']['no.nav.aap.behandlingsflyt.behandling.beregning.grunnlag.refusjon.RefusjonkravGrunnlagResponse'];

export type BeregningTidspunktGrunnlag =
  components['schemas']['no.nav.aap.behandlingsflyt.behandling.beregning.tidspunkt.BeregningTidspunktAvklaringResponse'];

export type TilkjentYtelseGrunnlag =
  components['schemas']['no.nav.aap.behandlingsflyt.behandling.tilkjentytelse.TilkjentYtelseDto'];
export type KvalitetssikringGrunnlag =
  components['schemas']['no.nav.aap.behandlingsflyt.behandling.kvalitetssikring.KvalitetssikringGrunnlagDto'];
export type BarnetilleggGrunnlag =
  components['schemas']['no.nav.aap.behandlingsflyt.behandling.barnetillegg.flate.BarnetilleggDto'];
export type Soningsgrunnlag =
  components['schemas']['no.nav.aap.behandlingsflyt.faktagrunnlag.saksbehandler.institusjon.flate.SoningsGrunnlag'];
export type HelseinstitusjonGrunnlag =
  components['schemas']['no.nav.aap.behandlingsflyt.faktagrunnlag.saksbehandler.institusjon.flate.HelseinstitusjonGrunnlag'];
export type Institusjonsopphold =
  components['schemas']['no.nav.aap.behandlingsflyt.faktagrunnlag.saksbehandler.institusjon.flate.InstitusjonsoppholdDto'];

export type FatteVedtakGrunnlag =
  components['schemas']['no.nav.aap.behandlingsflyt.behandling.avklaringsbehov.FatteVedtakGrunnlagDto'];

export type AlderGrunnlag =
  components['schemas']['no.nav.aap.behandlingsflyt.behandling.beregning.grunnlag.alder.AlderDTO'];

export type BrevGrunnlag = components['schemas']['no.nav.aap.behandlingsflyt.behandling.brev.BrevGrunnlag'];
export type Brev = components['schemas']['no.nav.aap.brev.kontrakt.Brev'];
export type BrevStatus =
  components['schemas']['no.nav.aap.behandlingsflyt.behandling.brev.BrevGrunnlag.Brev']['status'];
export type BrevMottaker =
  components['schemas']['no.nav.aap.behandlingsflyt.behandling.brev.BrevGrunnlag.Brev.Mottaker'];
export type Signatur = components['schemas']['no.nav.aap.brev.kontrakt.Signatur'];

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

export type SamordningAndreStatligeYtelserYtelse =
  components['schemas']['no.nav.aap.behandlingsflyt.faktagrunnlag.delvurdering.samordning.andrestatligeytelservurdering.SamordningAndreStatligeYtelserVurderingPeriodeDto']['ytelse'];

export type TrukketSøknadGrunnlag =
  components['schemas']['no.nav.aap.behandlingsflyt.behandling.søknad.TrukketSøknadGrunnlagDto'];
export type RettighetsperiodeGrunnlag =
  components['schemas']['no.nav.aap.behandlingsflyt.behandling.rettighetsperiode.RettighetsperiodeGrunnlagResponse'];
export type FormkravGrunnlag =
  components['schemas']['no.nav.aap.behandlingsflyt.faktagrunnlag.klage.formkrav.flate.FormkravGrunnlagDto'];
export type PåklagetBehandlingGrunnlag =
  components['schemas']['no.nav.aap.behandlingsflyt.faktagrunnlag.klage.påklagetbehandling.flate.PåklagetBehandlingGrunnlagDto'];
export type BehandlendeEnhetGrunnlag =
  components['schemas']['no.nav.aap.behandlingsflyt.faktagrunnlag.klage.behandlendeenhet.flate.BehandlendeEnhetGrunnlagDto'];
export type KlagebehandlingKontorGrunnlag =
  components['schemas']['no.nav.aap.behandlingsflyt.faktagrunnlag.klage.klagebehandling.kontor.flate.KlagebehandlingKontorGrunnlagDto'];
export type KlagebehandlingNayGrunnlag =
  components['schemas']['no.nav.aap.behandlingsflyt.faktagrunnlag.klage.klagebehandling.nay.flate.KlagebehandlingNayGrunnlagDto'];
export type Hjemmel =
  components['schemas']['no.nav.aap.behandlingsflyt.faktagrunnlag.klage.klagebehandling.kontor.flate.KlagevurderingKontorLøsningDto']['vilkårSomOmgjøres'][number];
export type KlageInnstilling =
  components['schemas']['no.nav.aap.behandlingsflyt.faktagrunnlag.klage.klagebehandling.kontor.flate.KlagevurderingKontorLøsningDto']['innstilling'];
export type Klageresultat = components['schemas']['no.nav.aap.behandlingsflyt.faktagrunnlag.klage.KlageResultat'];
export type TrekkKlageGrunnlag =
  components['schemas']['no.nav.aap.behandlingsflyt.behandling.klage.trekk.TrekkKlageGrunnlagDto'];
export type EffektuerAvvistPåFormkravGrunnlag =
  components['schemas']['no.nav.aap.behandlingsflyt.behandling.klage.effektueravvistpåformkrav.EffektuerAvvistPåFormkravGrunnlagDto'];
export type SvarFraAndreinstansGrunnlag =
  components['schemas']['no.nav.aap.behandlingsflyt.behandling.svarfraandreinstans.svarfraandreinstans.SvarFraAndreinstansGrunnlagDto'];
export type SvarKonsekvens =
  components['schemas']['no.nav.aap.behandlingsflyt.behandling.avklaringsbehov.løsning.HåndterSvarFraAndreinstansLøsningDto']['konsekvens'];
export type KabalUtfall = SvarFraAndreinstansGrunnlag['svarFraAndreinstans']['utfall'];
export type KabalSvarType = SvarFraAndreinstansGrunnlag['svarFraAndreinstans']['type'];
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
export type FinnSakForIdent =
  components['schemas']['no.nav.aap.behandlingsflyt.sakogbehandling.sak.flate.FinnSakForIdentDTO'];

export type Vilkår = components['schemas']['no.nav.aap.behandlingsflyt.flyt.flate.VilkårDTO'];

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

export type VilkårUtfall = components['schemas']['no.nav.aap.behandlingsflyt.flyt.flate.VilkårsperiodeDTO']['utfall'];
export type AvslagÅrsak =
  components['schemas']['no.nav.aap.behandlingsflyt.flyt.flate.VilkårsperiodeDTO']['avslagsårsak'];

export type ErStudentStatus =
  components['schemas']['no.nav.aap.behandlingsflyt.faktagrunnlag.saksbehandler.student.OppgittStudent']['erStudentStatus'];
export type SkalGjenopptaStudieStatus =
  components['schemas']['no.nav.aap.behandlingsflyt.faktagrunnlag.saksbehandler.student.OppgittStudent']['skalGjenopptaStudieStatus'];

export type IdentifisertBarn =
  components['schemas']['no.nav.aap.behandlingsflyt.behandling.barnetillegg.flate.IdentifiserteBarnDto'];

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

export type ForutgåendeMedlemskapGrunnlag =
  components['schemas']['no.nav.aap.behandlingsflyt.behandling.lovvalgmedlemskap.grunnlag.ForutgåendeMedlemskapGrunnlagResponse'];

export type LovvalgEØSLand =
  components['schemas']['no.nav.aap.behandlingsflyt.faktagrunnlag.lovvalgmedlemskap.LovvalgVedSøknadsTidspunktDto']['lovvalgsEØSLand'];

export type Sykdomsvurdering =
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

export type DokumentÅrsakTilBehandling = AnnetRelevantDokumentV0['årsakerTilBehandling'][number];

export type ÅrsakTilBehandling =
  components['schemas'][`no.nav.aap.behandlingsflyt.sakogbehandling.sak.flate.BehandlinginfoDTO`]['årsaker'][number];

// oppgave
export type Oppgave = oppgave['schemas']['no.nav.aap.oppgave.OppgaveDto'];

export type ReturStatus = NonNullable<Oppgave['returInformasjon']>['status'];

export type Behandlingsstatus = DetaljertBehandling['status'];
