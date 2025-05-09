import {
  AvklaringsbehovReferanse,
  Kø,
  NesteOppgaveRequestBody,
  NesteOppgaveResponse,
  Oppgave,
  OppgavelisteResponse,
  Paging,
  PlukkOppgaveDto,
} from './types/oppgaveTypes';
import {
  AntallÅpneOgGjennomsnitt,
  BehandlingPerSteggruppe,
  BehandlingÅrsakAntallGjennomsnitt,
  FordelingLukkedeBehandlinger,
  FordelingÅpneBehandlinger,
  VenteÅrsakOgGjennomsnitt,
} from './types/statistikkTypes';
import { BehandlingEndringerPerDag } from 'lib/types/statistikkTypes';
import { queryParamsArray } from './utils/request';
import { clientFetch } from 'lib/clientApi';

// statistikk
export async function antallÅpneBehandlingerPerBehandlingstypeClient(url: string) {
  return clientFetch<Array<AntallÅpneOgGjennomsnitt>>(url, 'GET');
}

export async function behandlingerUtviklingClient(url: string) {
  return clientFetch<Array<BehandlingEndringerPerDag>>(url, 'GET');
}

export async function fordelingÅpneBehandlingerClient(url: string) {
  return clientFetch<Array<FordelingÅpneBehandlinger>>(url, 'GET');
}

export async function fordelingLukkedeBehandlingerClient(url: string) {
  return clientFetch<Array<FordelingLukkedeBehandlinger>>(url, 'GET');
}

export async function venteÅrsakerClient(url: string) {
  return clientFetch<Array<VenteÅrsakOgGjennomsnitt>>(url, 'GET');
}

export async function behandlingerPerSteggruppeClient(url: string) {
  return clientFetch<Array<BehandlingPerSteggruppe>>(url, 'GET');
}

export async function årsakTilBehandlingClient(url: string) {
  return clientFetch<Array<BehandlingÅrsakAntallGjennomsnitt>>(url, 'GET');
}

// oppgave
export async function hentOppgaverClient(filterId: number, enheter: string[], veileder: boolean, paging: Paging) {
  return clientFetch<OppgavelisteResponse>('/oppgave/api/oppgave/oppgaveliste', 'POST', {
    filterId,
    enheter,
    veileder,
    paging,
  });
}

export async function hentMineOppgaverClient() {
  return clientFetch<OppgavelisteResponse>('/oppgave/api/oppgave/mine-oppgaver', 'GET');
}

export async function avreserverOppgaveClient(oppgave: Oppgave) {
  const body: AvklaringsbehovReferanse = {
    avklaringsbehovKode: oppgave.avklaringsbehovKode,
    journalpostId: oppgave.journalpostId,
    saksnummer: oppgave.saksnummer,
    referanse: oppgave.behandlingRef,
  };
  return clientFetch('/oppgave/api/oppgave/avreserver', 'POST', body);
}
export async function hentKøerForEnheterClient(enheter: string[]) {
  const url = `/oppgave/api/filter?${queryParamsArray('enheter', enheter)}`;
  return clientFetch<Kø[]>(url, 'GET');
}

export async function plukkNesteOppgaveClient(filterId: number, aktivEnhet: string) {
  const payload: NesteOppgaveRequestBody = { filterId, enheter: [aktivEnhet || ''] };
  return await clientFetch<NesteOppgaveResponse>('/oppgave/api/oppgave/neste', 'POST', payload);
}
export async function plukkOppgaveClient(oppgaveId: number, versjon: number) {
  const payload: PlukkOppgaveDto = { oppgaveId, versjon };
  return await clientFetch<Oppgave>('/oppgave/api/oppgave/plukk-oppgave', 'POST', payload);
}
