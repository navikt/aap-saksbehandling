import { components } from './schema';

export type BehandlingsInfo = components['schemas']['no.nav.aap.flate.sak.BehandlinginfoDTO'];
export type DetaljertBehandling = components['schemas']['no.nav.aap.flate.behandling.DetaljertBehandlingDTO'];
export type AvklaringsBehov = components['schemas']['no.nav.aap.flate.behandling.AvklaringsbehovDTO'];
export type EndringDto = components['schemas']['no.nav.aap.flate.behandling.EndringDTO'];
export type FinnSakForIdent = components['schemas']['no.nav.aap.flate.sak.FinnSakForIdentDTO'];
export type OpprettTestcase = components['schemas']['no.nav.aap.OpprettTestcaseDTO'];
export type Periode = components['schemas']['no.nav.aap.domene.Periode'];
export type UtvidetSaksInfo = components['schemas']['no.nav.aap.flate.sak.UtvidetSaksinfoDTO'];
export type SaksInfo = components['schemas']['no.nav.aap.flate.sak.SaksinfoDTO'];
export type Vilkår = components['schemas']['no.nav.aap.flate.behandling.VilkårDTO'];
export type LøsAvklaringsbehovPåBehandling =
  components['schemas']['no.nav.aap.flate.behandling.avklaringsbehov.LøsAvklaringsbehovPåBehandling'];
export type Vilkårsperiode = components['schemas']['no.nav.aap.flate.behandling.VilkårsperiodeDTO'];
export type SykdomsGrunnlag = components['schemas']['no.nav.aap.flate.behandling.SykdomsGrunnlagDto'];
export type BehandlingFlytOgTilstand = components['schemas']['no.nav.aap.flate.behandling.BehandlingFlytOgTilstandDto'];

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
  | 'AVKLAR_SYKDOM'
  | 'INNHENT_REGISTERDATA'
  | 'INNGANGSVILKÅR'
  | 'FASTSETT_GRUNNLAG'
  | 'FASTSETT_UTTAK'
  | 'BEREGN_TILKJENT_YTELSE'
  | 'SIMULERING'
  | 'FORESLÅ_VEDTAK'
  | 'FATTE_VEDTAK'
  | 'IVERKSETT_VEDTAK'
  | 'UDEFINERT'
  | 'AVSLUTT_BEHANDLING';
