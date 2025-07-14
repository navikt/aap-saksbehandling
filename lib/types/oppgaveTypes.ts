import { components as postmottak } from '@navikt/aap-postmottak-backend-typescript-types';
import {
  components as oppgave,
  NoNavAapOppgaveOppgaveDtoBehandlingstype,
  NoNavAapOppgaveOppgaveDtoStatus,
} from '@navikt/aap-oppgave-typescript-types';
import { BehandlingsFlytAvklaringsbehovKode } from 'lib/types/types';

// postmottak
export type PostmottakAvklaringsbehovKode =
  postmottak['schemas']['no.nav.aap.postmottak.kontrakt.avklaringsbehov.Definisjon']['kode'];

// oppgave
export type Kø = oppgave['schemas']['no.nav.aap.oppgave.filter.FilterDto'];
export type Oppgave = oppgave['schemas']['no.nav.aap.oppgave.OppgaveDto'];
export type OppgavelisteRequest = oppgave['schemas']['no.nav.aap.oppgave.liste.OppgavelisteRequest'];
export type Paging = OppgavelisteRequest['paging'];
export type Enhet = oppgave['schemas']['no.nav.aap.oppgave.enhet.EnhetDto'];
export type AvklaringsbehovReferanse = oppgave['schemas']['no.nav.aap.oppgave.AvklaringsbehovReferanseDto'];
export type OppgavelisteResponse = oppgave['schemas']['no.nav.aap.oppgave.liste.OppgavelisteRespons'];
export type NesteOppgaveResponse = oppgave['schemas']['no.nav.aap.oppgave.plukk.NesteOppgaveDto'];
export type NesteOppgaveRequestBody = oppgave['schemas']['no.nav.aap.oppgave.plukk.FinnNesteOppgaveDto'];
export type PlukkOppgaveDto = oppgave['schemas']['no.nav.aap.oppgave.plukk.PlukkOppgaveDto'];
export type SøkResponse = oppgave['schemas']['no.nav.aap.oppgave.SøkResponse']
export type AvreserverOppgaveDto = oppgave['schemas']['no.nav.aap.oppgave.AvreserverOppgaveDto']

// typer fra enums
export type OppgaveBehandlingstype = `${NoNavAapOppgaveOppgaveDtoBehandlingstype}`;
export type OppgaveStatus = `${NoNavAapOppgaveOppgaveDtoStatus}`;

export type OppgaveAvklaringsbehovKode = BehandlingsFlytAvklaringsbehovKode | PostmottakAvklaringsbehovKode;
export type FilterTidsEnhet = 'DAG' | 'UKE' | 'MÅNED' | 'ÅR';
