import { components } from './schema';

// Grunnlag
export type DokumentInfo = components['schemas']['no.nav.aap.behandlingsflyt.sakogbehandling.sak.adapters.Dokument'];
export type MedlemskapGrunnlag =
  components['schemas']['no.nav.aap.behandlingsflyt.faktagrunnlag.saksbehandler.medlemskap.flate.MedlemskapGrunnlagDto'];
export type StudentGrunnlag =
  components['schemas']['no.nav.aap.behandlingsflyt.faktagrunnlag.saksbehandler.student.flate.StudentGrunnlagDto'];
export type SykdomsGrunnlag =
  components['schemas']['no.nav.aap.behandlingsflyt.faktagrunnlag.saksbehandler.sykdom.flate.SykdomGrunnlagDto'];
export type SykepengeerstatningGrunnlag =
  components['schemas']['no.nav.aap.behandlingsflyt.faktagrunnlag.saksbehandler.sykdom.flate.SykepengerGrunnlagDto'];
export type BistandsGrunnlag =
  components['schemas']['no.nav.aap.behandlingsflyt.faktagrunnlag.saksbehandler.bistand.flate.BistandGrunnlagDto'];
export type FritakMeldepliktGrunnlag =
  components['schemas']['no.nav.aap.behandlingsflyt.faktagrunnlag.saksbehandler.meldeplikt.flate.FritakMeldepliktGrunnlagDto'];
export type ArbeidsevneGrunnlag =
  components['schemas']['no.nav.aap.behandlingsflyt.faktagrunnlag.saksbehandler.arbeidsevne.flate.ArbeidsevneGrunnlagDto'];
export type BeregningsVurdering =
  components['schemas']['no.nav.aap.behandlingsflyt.faktagrunnlag.saksbehandler.beregning.flate.BeregningsVurderingDTO'];
export type TilkjentYtelseGrunnlag =
  components['schemas']['no.nav.aap.behandlingsflyt.behandling.tilkjentytelse.flate.TilkjentYtelseDto'];
export type KvalitetssikringGrunnlag =
  components['schemas']['no.nav.aap.behandlingsflyt.behandling.avklaringsbehov.flate.KvalitetssikringGrunnlagDto'];
export type BarnetilleggGrunnlag =
  components['schemas']['no.nav.aap.behandlingsflyt.behandling.barnetillegg.flate.BarnetilleggDto'];
export type Soningsgrunnlag =
  components['schemas']['no.nav.aap.behandlingsflyt.faktagrunnlag.saksbehandler.institusjon.flate.SoningsGrunnlag'];
export type HelseinstitusjonGrunnlag =
  components['schemas']['no.nav.aap.behandlingsflyt.faktagrunnlag.saksbehandler.institusjon.flate.HelseinstitusjonGrunnlag'];
export type Institusjonsopphold =
  components['schemas']['no.nav.aap.behandlingsflyt.faktagrunnlag.saksbehandler.institusjon.flate.InstitusjonsoppholdDto'];
export type TilkjentYtelsePeriode =
  components['schemas']['no.nav.aap.behandlingsflyt.behandling.tilkjentytelse.flate.TilkjentYtelsePeriode'];

export type FatteVedtakGrunnlag =
  components['schemas']['no.nav.aap.behandlingsflyt.behandling.avklaringsbehov.flate.FatteVedtakGrunnlagDto'];

export type AlderGrunnlag = components['schemas']['no.nav.aap.behandlingsflyt.behandling.vilkår.alder.flate.AlderDTO'];

export type BrevGrunnlag = components['schemas']['no.nav.aap.brev.kontrakt.BrevbestillingResponse'];
export type Brev = components['schemas']['no.nav.aap.brev.kontrakt.Brev'];

// Behandling
export type DetaljertBehandling = components['schemas']['no.nav.aap.behandlingsflyt.flyt.flate.DetaljertBehandlingDTO'];
export type BehandlingFlytOgTilstand =
  components['schemas']['no.nav.aap.behandlingsflyt.flyt.flate.BehandlingFlytOgTilstandDto'];
export type FlytGruppe = components['schemas']['no.nav.aap.behandlingsflyt.flyt.flate.FlytGruppe'];

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
export type VilkårType = components['schemas']['no.nav.aap.behandlingsflyt.flyt.flate.VilkårDTO']['vilkårtype'];
export type Vilkårsperiode = components['schemas']['no.nav.aap.behandlingsflyt.flyt.flate.VilkårsperiodeDTO'];

export type BehandlingResultat = components['schemas']['no.nav.aap.behandlingsflyt.flyt.flate.BehandlingResultatDto'];

export type StegType = components['schemas']['no.nav.aap.behandlingsflyt.flyt.flate.FlytSteg']['stegType'];

export type StegGruppe = components['schemas']['no.nav.aap.behandlingsflyt.flyt.flate.FlytGruppe']['stegGruppe'];

export type ToTrinnsVurdering =
  components['schemas']['no.nav.aap.behandlingsflyt.behandling.avklaringsbehov.løser.vedtak.TotrinnsVurdering'];

export type ToTrinnsVurderingGrunn =
  components['schemas']['no.nav.aap.behandlingsflyt.behandling.avklaringsbehov.ÅrsakTilRetur']['årsak'];

export type HistorikkType =
  components['schemas']['no.nav.aap.behandlingsflyt.behandling.avklaringsbehov.flate.Historikk'];

export type HistorikkAksjon =
  components['schemas']['no.nav.aap.behandlingsflyt.behandling.avklaringsbehov.flate.Historikk']['aksjon'];

export type FlytProsessering =
  components['schemas']['no.nav.aap.behandlingsflyt.flyt.flate.BehandlingFlytOgTilstandDto']['prosessering'];

export type FlytProsesseringStatus =
  components['schemas']['no.nav.aap.behandlingsflyt.flyt.flate.BehandlingFlytOgTilstandDto']['prosessering']['status'];

export type BeregningsGrunnlag =
  components['schemas']['no.nav.aap.behandlingsflyt.behandling.beregning.flate.BeregningDTO'];

export type Grunnlag1119 =
  components['schemas']['no.nav.aap.behandlingsflyt.behandling.beregning.flate.Grunnlag11_19DTO'];

export type UføreGrunnlag =
  components['schemas']['no.nav.aap.behandlingsflyt.behandling.beregning.flate.UføreGrunnlagDTO'];

export type YrkesskadeGrunnlag =
  components['schemas']['no.nav.aap.behandlingsflyt.behandling.beregning.flate.YrkesskadeGrunnlagDTO'];

export type YrkesskadeUføreGrunnlag =
  components['schemas']['no.nav.aap.behandlingsflyt.behandling.beregning.flate.YrkesskadeUføreGrunnlagDTO'];

export type Inntekt = components['schemas']['no.nav.aap.behandlingsflyt.behandling.beregning.flate.InntektDTO'];
export type UføreInntekt =
  components['schemas']['no.nav.aap.behandlingsflyt.behandling.beregning.flate.UføreInntektDTO'];

export type SettPåVent = components['schemas']['no.nav.aap.behandlingsflyt.flyt.flate.SettPåVentRequest'];
export type SettPåVentÅrsaker =
  components['schemas']['no.nav.aap.behandlingsflyt.flyt.flate.SettPåVentRequest']['grunn'];

export type VenteInformasjon = components['schemas']['no.nav.aap.behandlingsflyt.flyt.flate.Venteinformasjon'];

export type VilkårUtfall = components['schemas']['no.nav.aap.behandlingsflyt.flyt.flate.VilkårsperiodeDTO']['utfall'];
export type AvslagÅrsak =
  components['schemas']['no.nav.aap.behandlingsflyt.flyt.flate.VilkårsperiodeDTO']['avslagsårsak'];

export type ErStudentStatus =
  components['schemas']['no.nav.aap.behandlingsflyt.faktagrunnlag.saksbehandler.student.OppgittStudent']['erStudentStatus'];
export type SkalGjenopptaStudieStatus =
  components['schemas']['no.nav.aap.behandlingsflyt.faktagrunnlag.saksbehandler.student.OppgittStudent']['skalGjenopptaStudieStatus'];

export type IdentifisertBarn =
  components['schemas']['no.nav.aap.behandlingsflyt.behandling.barnetillegg.flate.IdentifiserteBarnDto'];

export type Ident = components['schemas']['no.nav.aap.verdityper.sakogbehandling.Ident'];

export type AktivitetspliktHendelse =
  components['schemas']['no.nav.aap.behandlingsflyt.hendelse.bruddaktivitetsplikt.BruddAktivitetspliktHendelseDto'];

export type OpprettAktivitetspliktBrudd =
  components['schemas']['no.nav.aap.behandlingsflyt.hendelse.bruddaktivitetsplikt.OpprettAktivitetspliktDTO'];

export type OppdaterAktivitetspliktBrudd =
  components['schemas']['no.nav.aap.behandlingsflyt.hendelse.bruddaktivitetsplikt.OppdaterAktivitetspliktDTO'];

export type FeilregistrerAktivitetspliktBrudd =
  components['schemas']['no.nav.aap.behandlingsflyt.hendelse.bruddaktivitetsplikt.FeilregistrerAktivitetspliktDTO'];

export type AktivitetspliktHendelser =
  components['schemas']['no.nav.aap.behandlingsflyt.hendelse.bruddaktivitetsplikt.BruddAktivitetspliktResponse'];

export type AktivitetspliktParagraf =
  components['schemas']['no.nav.aap.behandlingsflyt.hendelse.bruddaktivitetsplikt.OpprettAktivitetspliktDTO']['paragraf'];

export type AktivitetspliktGrunn =
  components['schemas']['no.nav.aap.behandlingsflyt.hendelse.bruddaktivitetsplikt.OpprettAktivitetspliktDTO']['grunn'];

export type OppdaterAktivitetsplitGrunn =
  components['schemas']['no.nav.aap.behandlingsflyt.hendelse.bruddaktivitetsplikt.OppdaterAktivitetspliktDTO']['grunn'];

export type AktivitetspliktBrudd =
  components['schemas']['no.nav.aap.behandlingsflyt.hendelse.bruddaktivitetsplikt.OpprettAktivitetspliktDTO']['brudd'];

export type AktivitetspliktHendelseParagraf =
  components['schemas']['no.nav.aap.behandlingsflyt.hendelse.bruddaktivitetsplikt.BruddAktivitetspliktHendelseDto']['paragraf'];

export type FritakMeldepliktVurdering =
  components['schemas']['no.nav.aap.behandlingsflyt.faktagrunnlag.saksbehandler.meldeplikt.flate.FritakMeldepliktVurderingDto'];

export type SimulerMeldeplikt =
  components['schemas']['no.nav.aap.behandlingsflyt.faktagrunnlag.saksbehandler.meldeplikt.flate.SimulerFritakMeldepliktDto'];

export type SimulertMeldeplikt =
  components['schemas']['no.nav.aap.behandlingsflyt.faktagrunnlag.saksbehandler.meldeplikt.flate.SimulertFritakMeldepliktDto'];

export type FritaksvurderingDto =
  components['schemas']['no.nav.aap.behandlingsflyt.faktagrunnlag.saksbehandler.meldeplikt.flate.FritaksvurderingDto'];

export type Periode = components['schemas']['no.nav.aap.komponenter.type.Periode'];

export type BehandlingPersoninfo = components['schemas']['no.nav.aap.behandlingsflyt.flyt.flate.BehandlingPersoninfo'];

export type AvklaringsbehovKode =
  components['schemas']['no.nav.aap.behandlingsflyt.behandling.avklaringsbehov.løser.vedtak.TotrinnsVurdering']['definisjon'];

export type LegeerklæringStatus =
  components['schemas']['no.nav.aap.behandlingsflyt.faktagrunnlag.dokument.dokumentinnhenting.LegeerklæringStatusResponse'];
export type BestillLegeerklæring =
  components['schemas']['no.nav.aap.behandlingsflyt.behandling.dokumentinnhenting.BestillLegeerklæringDto'];
