import { components, paths as oppgavePaths } from './oppgaveSchema';
import { components as postmottakComponents } from './postmottakSchema';
import { BehandlingsFlytAvklaringsbehovKode } from 'lib/types/types';
import type { RequestBody, ResponseBody } from './openapi';

// postmottak
export type PostmottakAvklaringsbehovKode =
  postmottakComponents['schemas']['no.nav.aap.postmottak.kontrakt.avklaringsbehov.Definisjon']['kode'];

// oppgave
export type Kø = components['schemas']['no.nav.aap.oppgave.filter.FilterResponse'];
export type OppgavelisteRequest = RequestOfPost<'/oppgaveliste'>;
export type OppgavelisteResponse = ResponseOfPost<'/oppgaveliste'>;
export type OppgaveMedKontekst = components['schemas']['no.nav.aap.oppgave.liste.OppgaveMedKontekstResponse'];
export type ReturInformasjon = components['schemas']['no.nav.aap.oppgave.ReturInformasjonDto'];
export type SkjermingInfo =
  components['schemas']['no.nav.aap.oppgave.liste.OppgaveMedKontekstResponse']['oppgavelisteTags']['skjermingInfo'];
export type OppgaverPåSak = ResponseOfGet<'/{saksnummer}/hent-oppgaver-paa-sak'>;
export type OppgavePåBehandling = components['schemas']['no.nav.aap.oppgave.hent.OppgavePåBehandlingResponse'];
export type OppgaveVisningsinformasjon = ResponseOfGet<'/{referanse}/hent-oppgave-visningsinformasjon'>;
export type SaksnummerResponse = ResponseOfGet<'/{referanse}/hent-saksnummer'>;
export type Paging = OppgavelisteRequest['paging'];
export type Enhet = components['schemas']['no.nav.aap.oppgave.enhet.EnhetDto'];
export type PlukkOppgaveRequest = RequestOfPost<'/plukk-oppgave'>;
export type PlukkOppgaveResponse = ResponseOfPost<'/plukk-oppgave'>;
export type SøkResponse = ResponseOfPost<'/sok'>;
export type OppgaveInfoTilSøk = components['schemas']['no.nav.aap.oppgave.søk.OppgaveISøkResponse'];
export type BehandlingskontekstForOppgave = components['schemas']['no.nav.aap.oppgave.BehandlingskontekstResponse'];
export type AvreserverOppgaveDto = RequestOfPost<'/avreserver-oppgaver'>;
export type Markering = components['schemas']['no.nav.aap.oppgave.markering.MarkeringDto'];
export type EnhetSynkroniseringOppgave = RequestOfPost<'/synkroniser-enhet-paa-oppgave'>;
export type SaksbehandlerSøkRespons = ResponseOfPost<'/saksbehandler-sok'>;
export type SaksbehandlerSøkRequest = RequestOfPost<'/saksbehandler-sok'>;
export type SaksbehandlerFraSøk = components['schemas']['no.nav.aap.oppgave.tildel.SaksbehandlerDto'];
export type TildelOppgaveRequest = RequestOfPost<'/tildel-oppgaver'>;
export type TildelOppgaveResponse = ResponseOfPost<'/tildel-oppgaver'>;
export type TildeltStatus = components['schemas']['no.nav.aap.oppgave.tildel.TildeltStatusDto'];
export type SakOgAvklaringsbehov = components['schemas']['no.nav.aap.oppgave.SakOgAvklaringsbehov'];
export type UføreVedtakStatus = components['schemas']['no.nav.aap.oppgave.UførevedtakRespons']['resultat'];
export type UføreVedtak = RequestOfPost<'/fjern-uførevedtak-ikon'>;
export type OppdaterPåminnelseRequest = RequestOfPost<'/oppdater-paaminnelse'>;
export type ForespørselSendtTilBehandler = components['schemas']['no.nav.aap.oppgave.ForespørselSendtTilBehandlerDto'];

// Typer utledet direkte fra skjemaet (string unions)
export type Behandlingstype =
  components['schemas']['no.nav.aap.oppgave.BehandlingskontekstResponse']['behandlingstype'];
export type OppgaveBehandlingstype = Behandlingstype;
export type MarkeringType = components['schemas']['no.nav.aap.oppgave.markering.MarkeringDto']['markeringType'];
export type Køtype = components['schemas']['no.nav.aap.oppgave.filter.FilterResponse']['type'];
export type SortBy = NonNullable<components['schemas']['no.nav.aap.oppgave.liste.OppgaveSortering']['sortBy']>;
export type SortOrder = NonNullable<components['schemas']['no.nav.aap.oppgave.liste.OppgaveSortering']['sortOrder']>;
export type Status = components['schemas']['no.nav.aap.oppgave.liste.OppgaveMetadataResponse']['status'];
export type Behandlingstyper =
  components['schemas']['no.nav.aap.oppgave.liste.UtvidetOppgavelisteFilter']['behandlingstyper'];
export type ReturStatuser =
  components['schemas']['no.nav.aap.oppgave.liste.UtvidetOppgavelisteFilter']['returStatuser'];
export type ReturStatus = components['schemas']['no.nav.aap.oppgave.ReturInformasjonDto']['status'];
export type ReturÅrsaker = components['schemas']['no.nav.aap.oppgave.ReturInformasjonDto']['årsaker'][number];
export type MineOppgaverQueryParams = oppgavePaths['/mine-oppgaver']['get']['parameters']['query'];
export type MineOppgaverSortBy = NonNullable<NonNullable<MineOppgaverQueryParams>['sortby']>;
export type MineOppgaverSortOrder = NonNullable<NonNullable<MineOppgaverQueryParams>['sortorder']>;

export type OppgaveAvklaringsbehovKode = BehandlingsFlytAvklaringsbehovKode | PostmottakAvklaringsbehovKode;

export type OpprettMarkeringDto = RequestOfPost<'/{referanse}/opprett-markering-hendelse'>;
export type DokumenterLestDto = RequestOfPost<'/mottatt-dokumenter-lest'>;
export type SøkRequest = RequestOfPost<'/sok'>;

type RequestOfPost<Url extends keyof oppgavePaths> = RequestBody<oppgavePaths[Url]['post']>;
type ResponseOfPost<Url extends keyof oppgavePaths> = ResponseBody<oppgavePaths[Url]['post']>;
type ResponseOfGet<Url extends keyof oppgavePaths> = ResponseBody<oppgavePaths[Url]['get']>;
