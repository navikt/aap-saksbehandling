import { components, paths } from '@navikt/aap-statistikk-typescript-types';

// statistikk
export type BehandlingstidPerDagDTO =
  components['schemas']['no.nav.aap.statistikk.api.`ProduksjonsstyringApiKt$hentBehandlingstidPerDag$BehandlingstidPerDagDTO`'];
export type BehandlingPerAvklaringsbehov =
  components['schemas']['no.nav.aap.statistikk.produksjonsstyring.BehandlingPerAvklaringsbehov'];
export type BehandlingEndringerPerDag =
  components['schemas']['no.nav.aap.statistikk.api.`ProduksjonsstyringApiKt$hentBehandlingstidPerDag$BehandlinEndringerPerDag`'];
export type AntallÅpneOgGjennomsnitt =
  components['schemas']['no.nav.aap.statistikk.api.`ProduksjonsstyringApiKt$hentBehandlingstidPerDag$Antall\u00C5pneOgTypeOgGjennomsnittsalder`'];
export type FordelingÅpneBehandlinger =
  components['schemas']['no.nav.aap.statistikk.api.Fordeling\u00C5pneBehandlinger'];
export type FordelingLukkedeBehandlinger =
  components['schemas']['no.nav.aap.statistikk.api.FordelingLukkedeBehandlinger'];
export type VenteÅrsakOgGjennomsnitt =
  components['schemas']['no.nav.aap.statistikk.produksjonsstyring.Vente\u00E5rsakOgGjennomsnitt'];
export type BehandlingPerSteggruppe =
  components['schemas']['no.nav.aap.statistikk.produksjonsstyring.BehandlingPerSteggruppe'];
export type BehandlingÅrsakAntallGjennomsnitt =
  components['schemas']['no.nav.aap.statistikk.produksjonsstyring.BehandlingAarsakAntallGjennomsnitt'];
// typer fra enums
export type BehandlingstyperRequestQuery = `${NonNullable<
  NonNullable<paths['/behandlingstid']['get']['parameters']['query']>['behandlingstyper']
>[number]}`;
