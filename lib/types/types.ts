import { components } from './schema';

export type BehandlingsInfo = components['schemas']['no.nav.aap.behandlingsflyt.flate.sak.BehandlinginfoDTO'];
export type DetaljertBehandling =
  components['schemas']['no.nav.aap.behandlingsflyt.flate.behandling.DetaljertBehandlingDTO'];
export type AvklaringsBehov = components['schemas']['no.nav.aap.behandlingsflyt.flate.behandling.AvklaringsbehovDTO'];
export type EndringDto = components['schemas']['no.nav.aap.behandlingsflyt.flate.behandling.EndringDTO'];
export type FinnSakForIdent = components['schemas']['no.nav.aap.behandlingsflyt.flate.sak.FinnSakForIdentDTO'];
export type OpprettTestcase = components['schemas']['no.nav.aap.behandlingsflyt.OpprettTestcaseDTO'];
export type Periode = components['schemas']['no.nav.aap.behandlingsflyt.domene.Periode'];
export type UtvidetSaksInfo = components['schemas']['no.nav.aap.behandlingsflyt.flate.sak.UtvidetSaksinfoDTO'];
export type SaksInfo = components['schemas']['no.nav.aap.behandlingsflyt.flate.sak.SaksinfoDTO'];
export type Vilkår = components['schemas']['no.nav.aap.behandlingsflyt.flate.behandling.VilkårDTO'];
export type LøsAvklaringsbehovPåBehandling =
  components['schemas']['no.nav.aap.behandlingsflyt.flate.behandling.avklaringsbehov.LøsAvklaringsbehovPåBehandling'];
export type Vilkårsperiode = components['schemas']['no.nav.aap.behandlingsflyt.flate.behandling.VilkårsperiodeDTO'];
export type SykdomsGrunnlag = components['schemas']['no.nav.aap.behandlingsflyt.grunnlag.flate.SykdomsGrunnlagDto'];
export type YrkesskadeGrunnlag =
  components['schemas']['no.nav.aap.behandlingsflyt.grunnlag.flate.YrkesskadeGrunnlagDto'];
export type BistandsGrunnlag = components['schemas']['no.nav.aap.behandlingsflyt.grunnlag.flate.BistandGrunnlagDto'];
export type FritakMeldepliktGrunnlag =
  components['schemas']['no.nav.aap.behandlingsflyt.grunnlag.flate.FritakMeldepliktGrunnlagDto'];
export type BehandlingFlytOgTilstand =
  components['schemas']['no.nav.aap.behandlingsflyt.flate.behandling.BehandlingFlytOgTilstand2Dto'];
export type BehandlingFlytOgTilstand2 =
  components['schemas']['no.nav.aap.behandlingsflyt.flate.behandling.BehandlingFlytOgTilstand2Dto'];
export type FlytGruppe = components['schemas']['no.nav.aap.behandlingsflyt.flate.behandling.FlytGruppe'];

//TODO Disse blir ikke generert riktig av swagger
// export type VilkårsType = components['schemas']['Vilkrstype'];
// export type StegType = components['schemas']['StegType'];
// export type Definisjon = components['schemas']['Definisjon'];

export interface Dokument {
  journalpostId: string;
  dokumentId: string;
  tittel: string;
  åpnet?: Date;
  erTilknyttet: boolean;
}

export type StegType =
  | 'START_BEHANDLING'
  | 'VURDER_ALDER'
  | 'VURDER_LOVVALG'
  | 'VURDER_MEDLEMSKAP'
  | 'INNHENT_MEDLEMSKAP'
  | 'VURDER_BISTANDSBEHOV'
  | 'VURDER_SYKEPENGEERSTATNING'
  | 'FRITAK_MELDEPLIKT'
  | 'BARNETILLEGG'
  | 'SAMORDNING'
  | 'AVKLAR_YRKESSKADE'
  | 'AVKLAR_SYKDOM'
  | 'INNHENT_PERSONOPPLYSNINGER'
  | 'INNHENT_YRKESSKADE'
  | 'FASTSETT_GRUNNLAG'
  | 'INNHENT_INNTEKTSOPPLYSNINGER'
  | 'FASTSETT_UTTAK'
  | 'BEREGN_TILKJENT_YTELSE'
  | 'SIMULERING'
  | 'FORESLÅ_VEDTAK'
  | 'FATTE_VEDTAK'
  | 'IVERKSETT_VEDTAK'
  | 'UDEFINERT';

export type StegGruppe =
  | 'START_BEHANDLING'
  | 'ALDER'
  | 'LOVVALG'
  | 'MEDLEMSKAP'
  | 'BARNETILLEGG'
  | 'SAMORDNING'
  | 'SYKDOM'
  | 'GRUNNLAG'
  | 'UTTAK'
  | 'TILKJENT_YTELSE'
  | 'SIMULERING'
  | 'VEDTAK'
  | 'UDEFINERT';
