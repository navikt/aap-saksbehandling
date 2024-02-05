import { components } from './schema';

// Grunnlag
export type StudentGrunnlag =
  components['schemas']['no.nav.aap.behandlingsflyt.faktagrunnlag.saksbehandler.student.flate.StudentGrunnlagDto'];
export type SykdomsGrunnlag =
  components['schemas']['no.nav.aap.behandlingsflyt.faktagrunnlag.saksbehandler.sykdom.flate.SykdomGrunnlagDto'];
export type YrkesskadeGrunnlag =
  components['schemas']['no.nav.aap.behandlingsflyt.faktagrunnlag.saksbehandler.sykdom.flate.YrkesskadeGrunnlagDto'];
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
export type FlytSteg = components['schemas']['no.nav.aap.behandlingsflyt.flyt.flate.FlytSteg'];

// Sak
export type SaksInfo = components['schemas']['no.nav.aap.behandlingsflyt.sakogbehandling.sak.flate.UtvidetSaksinfoDTO'];
export type UtvidetSaksInfo =
  components['schemas']['no.nav.aap.behandlingsflyt.sakogbehandling.sak.flate.UtvidetSaksinfoDTO'];
export type OpprettTestcase = components['schemas']['no.nav.aap.behandlingsflyt.OpprettTestcaseDTO'];
export type FinnSakForIdent =
  components['schemas']['no.nav.aap.behandlingsflyt.sakogbehandling.sak.flate.FinnSakForIdentDTO'];

export type AvklaringsBehov = components['schemas']['no.nav.aap.behandlingsflyt.flyt.flate.AvklaringsbehovDTO'];
export type EndringDto = components['schemas']['no.nav.aap.behandlingsflyt.flyt.flate.EndringDTO'];
export type Periode = components['schemas']['no.nav.aap.verdityper.Periode'];
export type Vilkår = components['schemas']['no.nav.aap.behandlingsflyt.flyt.flate.VilkårDTO'];
export type LøsAvklaringsbehovPåBehandling =
  components['schemas']['no.nav.aap.behandlingsflyt.avklaringsbehov.flate.LøsAvklaringsbehovPåBehandling'];
export type Vilkårsperiode = components['schemas']['no.nav.aap.behandlingsflyt.flyt.flate.VilkårsperiodeDTO'];

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
  | 'FASTSETT_ARBEIDSEVNE'
  | 'BEREGN_TILKJENT_YTELSE'
  | 'SIMULERING'
  | 'FORESLÅ_VEDTAK'
  | 'FATTE_VEDTAK'
  | 'IVERKSETT_VEDTAK'
  | 'UDEFINERT'
  | 'VURDER_UUTNYTTET_ARBEIDSEVNE'; // TODO manuelt lagt inn, må få rett type fra backend

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
  | 'BREV' // TODO manuelt lagt inn, må legges inn i backend
  | 'UDEFINERT';
