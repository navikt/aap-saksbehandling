import { components } from './schema';

// Grunnlag
export type StudentGrunnlag =
  components['schemas']['no.nav.aap.behandlingsflyt.faktagrunnlag.saksbehandler.student.flate.StudentGrunnlagDto'];
export type SykdomsGrunnlag =
  components['schemas']['no.nav.aap.behandlingsflyt.faktagrunnlag.saksbehandler.sykdom.flate.SykdomGrunnlagDto'];
export type SykepengeerstatningGrunnlag =
  components['schemas']['no.nav.aap.behandlingsflyt.faktagrunnlag.saksbehandler.sykdom.SykepengerVurdering'];
export type BistandsGrunnlag =
  components['schemas']['no.nav.aap.behandlingsflyt.faktagrunnlag.saksbehandler.bistand.flate.BistandGrunnlagDto'];
export type FritakMeldepliktGrunnlag =
  components['schemas']['no.nav.aap.behandlingsflyt.faktagrunnlag.saksbehandler.meldeplikt.flate.FritakMeldepliktGrunnlagDto'];
export type FatteVedtakGrunnlag =
  components['schemas']['no.nav.aap.behandlingsflyt.avklaringsbehov.flate.FatteVedtakGrunnlagDto'];

// Behandling
export type DetaljertBehandling = components['schemas']['no.nav.aap.behandlingsflyt.flyt.flate.DetaljertBehandlingDTO'];
export type BehandlingFlytOgTilstand =
  components['schemas']['no.nav.aap.behandlingsflyt.flyt.flate.BehandlingFlytOgTilstandDto'];
export type FlytGruppe = components['schemas']['no.nav.aap.behandlingsflyt.flyt.flate.FlytGruppe'];

export type LøsAvklaringsbehovPåBehandling =
  components['schemas']['no.nav.aap.behandlingsflyt.avklaringsbehov.flate.LøsAvklaringsbehovPåBehandling'];

// Sak
export type SaksInfo = components['schemas']['no.nav.aap.behandlingsflyt.sakogbehandling.sak.flate.UtvidetSaksinfoDTO'];

export type OpprettTestcase = components['schemas']['no.nav.aap.behandlingsflyt.OpprettTestcaseDTO'];
export type FinnSakForIdent =
  components['schemas']['no.nav.aap.behandlingsflyt.sakogbehandling.sak.flate.FinnSakForIdentDTO'];

export type Vilkår = components['schemas']['no.nav.aap.behandlingsflyt.flyt.flate.VilkårDTO'];
export type VilkårType = components['schemas']['no.nav.aap.behandlingsflyt.flyt.flate.VilkårDTO']['vilkårtype'];
export type Vilkårsperiode = components['schemas']['no.nav.aap.behandlingsflyt.flyt.flate.VilkårsperiodeDTO'];

export type BehandlingResultat = components['schemas']['no.nav.aap.behandlingsflyt.flyt.flate.BehandlingResultatDto'];

export type StegType = components['schemas']['no.nav.aap.behandlingsflyt.flyt.flate.FlytSteg']['stegType'];

export type StegGruppe = components['schemas']['no.nav.aap.behandlingsflyt.flyt.flate.FlytGruppe']['stegGruppe'];
