import { components } from './schema';
// Verdityper
export type Periode = components['schemas']['no.nav.aap.verdityper.Periode'];

// Grunnlag
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
export type BeregningsVurdering =
  components['schemas']['no.nav.aap.behandlingsflyt.faktagrunnlag.saksbehandler.beregning.flate.BeregningsVurderingDTO'];
export type TilkjentYtelseGrunnlag =
  components['schemas']['no.nav.aap.behandlingsflyt.tilkjentytelse.flate.TilkjentYtelseDto'];
export type KvalitetssikringGrunnlag =
  components['schemas']['no.nav.aap.behandlingsflyt.avklaringsbehov.flate.KvalitetssikringGrunnlagDto'];

export type TilkjentYtelsePeriode =
  components['schemas']['no.nav.aap.behandlingsflyt.tilkjentytelse.flate.TilkjentYtelsePeriode'];
export type Tilkjent = components['schemas']['no.nav.aap.behandlingsflyt.forretningsflyt.steg.Tilkjent'];

export type FatteVedtakGrunnlag =
  components['schemas']['no.nav.aap.behandlingsflyt.avklaringsbehov.flate.FatteVedtakGrunnlagDto'];

export type AlderGrunnlag = components['schemas']['no.nav.aap.behandlingsflyt.vilkår.alder.flate.AlderDTO'];

// Behandling
export type DetaljertBehandling = components['schemas']['no.nav.aap.behandlingsflyt.flyt.flate.DetaljertBehandlingDTO'];
export type BehandlingFlytOgTilstand =
  components['schemas']['no.nav.aap.behandlingsflyt.flyt.flate.BehandlingFlytOgTilstandDto'];
export type FlytGruppe = components['schemas']['no.nav.aap.behandlingsflyt.flyt.flate.FlytGruppe'];

export type LøsAvklaringsbehovPåBehandling =
  components['schemas']['no.nav.aap.behandlingsflyt.avklaringsbehov.flate.LøsAvklaringsbehovPåBehandling'];

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
  components['schemas']['no.nav.aap.behandlingsflyt.avklaringsbehov.løser.vedtak.TotrinnsVurdering'];

export type ToTrinnsVurderingGrunn =
  components['schemas']['no.nav.aap.behandlingsflyt.avklaringsbehov.ÅrsakTilRetur']['årsak'];

export type HistorikkType = components['schemas']['no.nav.aap.behandlingsflyt.avklaringsbehov.flate.Historikk'];

export type HistorikkAksjon =
  components['schemas']['no.nav.aap.behandlingsflyt.avklaringsbehov.flate.Historikk']['aksjon'];

export type FlytProsessering =
  components['schemas']['no.nav.aap.behandlingsflyt.flyt.flate.BehandlingFlytOgTilstandDto']['prosessering'];

export type FlytProsesseringStatus =
  components['schemas']['no.nav.aap.behandlingsflyt.flyt.flate.BehandlingFlytOgTilstandDto']['prosessering']['status'];

export type BeregningsGrunnlag = components['schemas']['no.nav.aap.behandlingsflyt.beregning.flate.BeregningDTO'];

export type SettPåVent = components['schemas']['no.nav.aap.behandlingsflyt.flyt.flate.SettPåVentRequest'];
export type SettPåVentÅrsaker =
  components['schemas']['no.nav.aap.behandlingsflyt.flyt.flate.SettPåVentRequest']['grunn'];

export type VenteInformasjon = components['schemas']['no.nav.aap.behandlingsflyt.flyt.flate.Venteinformasjon'];

export type OpprettYrkesskadeTestCase = components['schemas']['no.nav.aap.behandlingsflyt.OpprettYrkesskadeTestCase'];

export type VilkårUtfall = components['schemas']['no.nav.aap.behandlingsflyt.flyt.flate.VilkårsperiodeDTO']['utfall'];
export type AvslagÅrsak =
  components['schemas']['no.nav.aap.behandlingsflyt.flyt.flate.VilkårsperiodeDTO']['avslagsårsak'];

export type AktivitetInnsendingDto =
  components['schemas']['no.nav.aap.behandlingsflyt.faktagrunnlag.dokument.kontrakt.aktivitet.TorsHammerDto'];
export type AktivitetDto =
  components['schemas']['no.nav.aap.behandlingsflyt.faktagrunnlag.dokument.kontrakt.aktivitet.HammerDto'];
export type AktivitetDtoType = AktivitetDto['type'];
