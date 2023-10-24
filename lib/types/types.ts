import { components } from './schema';

// Grunnlag
export type StudentGrunnlag =
  components['schemas']['no.nav.aap.behandlingsflyt.faktagrunnlag.student.flate.StudentGrunnlagDto'];
export type SykdomsGrunnlag =
  components['schemas']['no.nav.aap.behandlingsflyt.faktagrunnlag.sykdom.flate.SykdomsGrunnlagDto'];
export type YrkesskadeGrunnlag =
  components['schemas']['no.nav.aap.behandlingsflyt.faktagrunnlag.sykdom.flate.YrkesskadeGrunnlagDto'];
export type BistandsGrunnlag =
  components['schemas']['no.nav.aap.behandlingsflyt.faktagrunnlag.bistand.flate.BistandGrunnlagDto'];
export type FritakMeldepliktGrunnlag =
  components['schemas']['no.nav.aap.behandlingsflyt.faktagrunnlag.meldeplikt.flate.FritakMeldepliktGrunnlagDto'];
export type FatteVedtakGrunnlag =
  components['schemas']['no.nav.aap.behandlingsflyt.faktagrunnlag.flate.FatteVedtakGrunnlagDto'];

// Behandling
export type BehandlingsInfo = components['schemas']['no.nav.aap.behandlingsflyt.flate.sak.BehandlinginfoDTO'];
export type DetaljertBehandling =
  components['schemas']['no.nav.aap.behandlingsflyt.flate.behandling.DetaljertBehandlingDTO'];
export type BehandlingFlytOgTilstand =
  components['schemas']['no.nav.aap.behandlingsflyt.flate.behandling.BehandlingFlytOgTilstand2Dto'];
export type FlytGruppe = components['schemas']['no.nav.aap.behandlingsflyt.flate.behandling.FlytGruppe'];
export type FlytSteg = components['schemas']['no.nav.aap.behandlingsflyt.flate.behandling.FlytSteg'];

// Sak
export type SaksInfo = components['schemas']['no.nav.aap.behandlingsflyt.flate.sak.SaksinfoDTO'];
export type UtvidetSaksInfo = components['schemas']['no.nav.aap.behandlingsflyt.flate.sak.UtvidetSaksinfoDTO'];
export type OpprettTestcase = components['schemas']['no.nav.aap.behandlingsflyt.OpprettTestcaseDTO'];
export type FinnSakForIdent = components['schemas']['no.nav.aap.behandlingsflyt.flate.sak.FinnSakForIdentDTO'];

export type AvklaringsBehov = components['schemas']['no.nav.aap.behandlingsflyt.flate.behandling.AvklaringsbehovDTO'];
export type EndringDto = components['schemas']['no.nav.aap.behandlingsflyt.flate.behandling.EndringDTO'];
export type Periode = components['schemas']['no.nav.aap.behandlingsflyt.domene.Periode'];
export type Vilkår = components['schemas']['no.nav.aap.behandlingsflyt.flate.behandling.VilkårDTO'];
export type LøsAvklaringsbehovPåBehandling =
  components['schemas']['no.nav.aap.behandlingsflyt.flate.behandling.avklaringsbehov.LøsAvklaringsbehovPåBehandling'];
export type Vilkårsperiode = components['schemas']['no.nav.aap.behandlingsflyt.flate.behandling.VilkårsperiodeDTO'];

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
  | 'AVKLAR_STUDENT'
  | 'VURDER_BISTANDSBEHOV'
  | 'VURDER_SYKEPENGEERSTATNING'
  | 'FRITAK_MELDEPLIKT'
  | 'BARNETILLEGG'
  | 'SAMORDNING'
  | 'AVKLAR_YRKESSKADE'
  | 'AVKLAR_SYKDOM'
  | 'FASTSETT_GRUNNLAG'
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
  | 'SYKEPENGEERSTATNING'
  | 'GRUNNLAG'
  | 'UTTAK'
  | 'TILKJENT_YTELSE'
  | 'SIMULERING'
  | 'VEDTAK'
  | 'UDEFINERT';
