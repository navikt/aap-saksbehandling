import { components as oppgave, paths as oppgavePaths } from '@navikt/aap-oppgave-typescript-types';
import { components as postmottak } from '@navikt/aap-postmottak-backend-typescript-types';
import { BehandlingsFlytAvklaringsbehovKode } from 'lib/types/types';

// Re-eksporter skjemaet så andre filer kan referere direkte
export type { oppgave, oppgavePaths };

// postmottak
export type PostmottakAvklaringsbehovKode =
  postmottak['schemas']['no.nav.aap.postmottak.kontrakt.avklaringsbehov.Definisjon']['kode'];

// oppgave
export type Kø = oppgave['schemas']['no.nav.aap.oppgave.filter.FilterResponse'];
export type OppgavelisteRequest = oppgave['schemas']['no.nav.aap.oppgave.liste.OppgavelisteRequest'];
export type OppgavelisteResponse = oppgave['schemas']['no.nav.aap.oppgave.liste.OppgavelisteRespons'];
export type OppgaveMedKontekst = oppgave['schemas']['no.nav.aap.oppgave.liste.OppgaveMedKontekstResponse'];
export type ReturInformasjon = oppgave['schemas']['no.nav.aap.oppgave.ReturInformasjonDto'];
export type SkjermingInfo =
  oppgave['schemas']['no.nav.aap.oppgave.liste.OppgaveMedKontekstResponse']['oppgavelisteTags']['skjermingInfo'];
export type OppgaverPåSak = oppgave['schemas']['no.nav.aap.oppgave.hent.OppgaverPåSakResponse'];
export type OppgavePåBehandling = oppgave['schemas']['no.nav.aap.oppgave.hent.OppgavePåBehandlingResponse'];
export type OppgaveVisningsinformasjon =
  oppgave['schemas']['no.nav.aap.oppgave.hent.OppgaveVisningsinformasjonResponse'];
export type SaksnummerResponse = oppgave['schemas']['no.nav.aap.oppgave.hent.SaksnummerResponse'];
export type Paging = OppgavelisteRequest['paging'];
export type Enhet = oppgave['schemas']['no.nav.aap.oppgave.enhet.EnhetDto'];
export type PlukkOppgaveRequest = oppgave['schemas']['no.nav.aap.oppgave.plukk.PlukkOppgaveRequest'];
export type PlukkOppgaveResponse = oppgave['schemas']['no.nav.aap.oppgave.plukk.PlukkOppgaveResponse'];
export type SøkResponse = oppgave['schemas']['no.nav.aap.oppgave.søk.SøkResponse'];
export type OppgaveInfoTilSøk = oppgave['schemas']['no.nav.aap.oppgave.søk.OppgaveISøkResponse'];
export type BehandlingskontekstForOppgave = oppgave['schemas']['no.nav.aap.oppgave.BehandlingskontekstResponse'];
export type AvreserverOppgaveDto = oppgave['schemas']['no.nav.aap.oppgave.plukk.AvreserverOppgaveDto'];
export type Markering = oppgave['schemas']['no.nav.aap.oppgave.markering.MarkeringDto'];
export type EnhetSynkroniseringOppgave = oppgave['schemas']['no.nav.aap.oppgave.enhet.EnhetSynkroniseringRequest'];
export type SaksbehandlerSøkRespons = oppgave['schemas']['no.nav.aap.oppgave.tildel.SaksbehandlerSøkResponse'];
export type SaksbehandlerSøkRequest = oppgave['schemas']['no.nav.aap.oppgave.tildel.SaksbehandlerSøkRequest'];
export type SaksbehandlerFraSøk = oppgave['schemas']['no.nav.aap.oppgave.tildel.SaksbehandlerDto'];
export type TildelOppgaveRequest = oppgave['schemas']['no.nav.aap.oppgave.tildel.TildelOppgaveRequest'];
export type TildelOppgaveResponse = oppgave['schemas']['no.nav.aap.oppgave.tildel.TildelOppgaveResponse'];
export type TildeltStatus = oppgave['schemas']['no.nav.aap.oppgave.tildel.TildeltStatusDto'];
export type SakOgAvklaringsbehov = oppgave['schemas']['no.nav.aap.oppgave.SakOgAvklaringsbehov'];

// Typer utledet direkte fra skjemaet (string unions)
export type Behandlingstype = oppgave['schemas']['no.nav.aap.oppgave.BehandlingskontekstResponse']['behandlingstype'];
export type OppgaveBehandlingstype = Behandlingstype;
export type MarkeringType = oppgave['schemas']['no.nav.aap.oppgave.markering.MarkeringDto']['markeringType'];
export type Køtype = oppgave['schemas']['no.nav.aap.oppgave.filter.FilterResponse']['type'];
export type SortBy = NonNullable<oppgave['schemas']['no.nav.aap.oppgave.liste.OppgaveSortering']['sortBy']>;
export type SortOrder = NonNullable<oppgave['schemas']['no.nav.aap.oppgave.liste.OppgaveSortering']['sortOrder']>;
export type Status = oppgave['schemas']['no.nav.aap.oppgave.liste.OppgaveMetadataResponse']['status'];
export type Behandlingstyper =
  oppgave['schemas']['no.nav.aap.oppgave.liste.UtvidetOppgavelisteFilter']['behandlingstyper'];
export type ReturStatuser = oppgave['schemas']['no.nav.aap.oppgave.liste.UtvidetOppgavelisteFilter']['returStatuser'];
export type ReturStatus = oppgave['schemas']['no.nav.aap.oppgave.ReturInformasjonDto']['status'];
export type ReturÅrsaker = oppgave['schemas']['no.nav.aap.oppgave.ReturInformasjonDto']['årsaker'][number];
export type MineOppgaverQueryParams = oppgavePaths['/mine-oppgaver']['get']['parameters']['query'];
export type MineOppgaverSortBy = NonNullable<NonNullable<MineOppgaverQueryParams>['sortby']>;
export type MineOppgaverSortOrder = NonNullable<NonNullable<MineOppgaverQueryParams>['sortorder']>;

export type OppgaveAvklaringsbehovKode = BehandlingsFlytAvklaringsbehovKode | PostmottakAvklaringsbehovKode;
