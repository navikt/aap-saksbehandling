import {
  NoNavAapOppgaveFilterFilterDtoType,
  NoNavAapOppgaveMarkeringMarkeringDtoMarkeringType,
  NoNavAapOppgaveOppgaveDtoBehandlingstype,
  components as oppgave,
  paths,
} from '@navikt/aap-oppgave-typescript-types';
import { components as postmottak } from '@navikt/aap-postmottak-backend-typescript-types';
import { BehandlingsFlytAvklaringsbehovKode } from 'lib/types/types';

// postmottak
export type PostmottakAvklaringsbehovKode =
  postmottak['schemas']['no.nav.aap.postmottak.kontrakt.avklaringsbehov.Definisjon']['kode'];

// oppgave
export type Kø = oppgave['schemas']['no.nav.aap.oppgave.filter.FilterDto'];
export type Oppgave = oppgave['schemas']['no.nav.aap.oppgave.OppgaveDto'];
export type OppgavelisteRequest = oppgave['schemas']['no.nav.aap.oppgave.liste.OppgavelisteRequest'] & {
  /** Sorter hastemarkerte oppgaver først. Ikke del av OpenAPI-skjema ennå. */
  hastemarkeringerFørst?: boolean;
};
export type OppgavelisteResponse = oppgave['schemas']['no.nav.aap.oppgave.liste.OppgavelisteRespons'];
export type OppgaverPåSak = oppgave['schemas']['no.nav.aap.oppgave.hent.OppgaverPåSakResponse'];
export type OppgavePåBehandling = oppgave['schemas']['no.nav.aap.oppgave.hent.OppgavePåBehandlingResponse'];
export type OppgaveVisningsinformasjon =
  oppgave['schemas']['no.nav.aap.oppgave.hent.OppgaveVisningsinformasjonResponse'];
export type Paging = OppgavelisteRequest['paging'];
export type Enhet = oppgave['schemas']['no.nav.aap.oppgave.enhet.EnhetDto'];
export type PlukkOppgaveRequest = oppgave['schemas']['no.nav.aap.oppgave.plukk.PlukkOppgaveRequest'];
export type PlukkOppgaveResponse = oppgave['schemas']['no.nav.aap.oppgave.plukk.PlukkOppgaveResponse'];
export type SøkResponse = oppgave['schemas']['no.nav.aap.oppgave.søk.SøkResponse'];
export type OppgaveInfoTilSøk = oppgave['schemas']['no.nav.aap.oppgave.søk.OppgaveISøkResponse'];
export type BehandlingskontekstForOppgave = oppgave['schemas']['no.nav.aap.oppgave.BehandlingskontekstResponse'];
export type AvreserverOppgaveDto = oppgave['schemas']['no.nav.aap.oppgave.AvreserverOppgaveDto'];
export type Markering = oppgave['schemas']['no.nav.aap.oppgave.markering.MarkeringDto'];
export type EnhetSynkroniseringOppgave = oppgave['schemas']['no.nav.aap.oppgave.enhet.EnhetSynkroniseringRequest'];
export type SaksbehandlerSøkRespons = oppgave['schemas']['no.nav.aap.oppgave.tildel.SaksbehandlerSøkResponse'];
export type SaksbehandlerSøkRequest = oppgave['schemas']['no.nav.aap.oppgave.tildel.SaksbehandlerSøkRequest'];
export type SaksbehandlerFraSøk = oppgave['schemas']['no.nav.aap.oppgave.tildel.SaksbehandlerDto'];
export type TildelOppgaveRequest = oppgave['schemas']['no.nav.aap.oppgave.tildel.TildelOppgaveRequest'];
export type TildelOppgaveResponse = oppgave['schemas']['no.nav.aap.oppgave.tildel.TildelOppgaveResponse'];
export type TildeltStatus = oppgave['schemas']['no.nav.aap.oppgave.tildel.TildeltStatusDto'];
export type SakOgAvklaringsbehov = oppgave['schemas']['no.nav.aap.oppgave.SakOgAvklaringsbehov'];

// typer fra enums
export type OppgaveBehandlingstype = `${NoNavAapOppgaveOppgaveDtoBehandlingstype}`;
export type MarkeringType = `${NoNavAapOppgaveMarkeringMarkeringDtoMarkeringType}`;
export const MarkeringHaster = NoNavAapOppgaveMarkeringMarkeringDtoMarkeringType.HASTER;

export type OppgaveAvklaringsbehovKode = BehandlingsFlytAvklaringsbehovKode | PostmottakAvklaringsbehovKode;

export type MineOppgaverQueryParams = paths['/mine-oppgaver']['get']['parameters']['query'];

export const Køtype = NoNavAapOppgaveFilterFilterDtoType;
export type Køtype = NoNavAapOppgaveFilterFilterDtoType;
