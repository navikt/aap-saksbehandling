import {
  AvklaringsbehovReferanse,
  Kø,
  NesteOppgaveRequestBody,
  NesteOppgaveResponse,
  Oppgave,
  OppgavelisteResponse,
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
import { clientFetchV2 } from 'lib/clientApi';

// statistikk
export async function antallÅpneBehandlingerPerBehandlingstypeClient(url: string) {
  return clientFetchV2<Array<AntallÅpneOgGjennomsnitt>>(url, 'GET');
}

export async function behandlingerUtviklingClient(url: string) {
  return clientFetchV2<Array<BehandlingEndringerPerDag>>(url, 'GET');
}

export async function fordelingÅpneBehandlingerClient(url: string) {
  return clientFetchV2<Array<FordelingÅpneBehandlinger>>(url, 'GET');
}

export async function fordelingLukkedeBehandlingerClient(url: string) {
  return clientFetchV2<Array<FordelingLukkedeBehandlinger>>(url, 'GET');
}

export async function venteÅrsakerClient(url: string) {
  return clientFetchV2<Array<VenteÅrsakOgGjennomsnitt>>(url, 'GET');
}

export async function behandlingerPerSteggruppeClient(url: string) {
  return clientFetchV2<Array<BehandlingPerSteggruppe>>(url, 'GET');
}

export async function årsakTilBehandlingClient(url: string) {
  return clientFetchV2<Array<BehandlingÅrsakAntallGjennomsnitt>>(url, 'GET');
}

// oppgave
export async function hentOppgaverClient(filterId: number, enheter: string[], veileder: boolean) {
  return clientFetchV2<OppgavelisteResponse>('/oppgave/api/oppgave/oppgaveliste', 'POST', {
    filterId,
    enheter,
    veileder,
  });
}

export async function hentMineOppgaverClient() {
  return clientFetchV2<OppgavelisteResponse>('/oppgave/api/oppgave/mine-oppgaver', 'GET');
}

export async function avreserverOppgaveClient(oppgave: Oppgave) {
  const body: AvklaringsbehovReferanse = {
    avklaringsbehovKode: oppgave.avklaringsbehovKode,
    journalpostId: oppgave.journalpostId,
    saksnummer: oppgave.saksnummer,
    referanse: oppgave.behandlingRef,
  };
  return clientFetchV2('/oppgave/api/oppgave/avreserver', 'POST', body);
}
export async function hentKøerForEnheterClient(enheter: string[]) {
  const url = `/oppgave/api/filter?${queryParamsArray('enheter', enheter)}`;
  return clientFetchV2<Kø[]>(url, 'GET');
}

export async function plukkNesteOppgaveClient(filterId: number, aktivEnhet: string) {
  const payload: NesteOppgaveRequestBody = { filterId, enheter: [aktivEnhet || ''] };
  return await clientFetchV2<NesteOppgaveResponse>('/oppgave/api/oppgave/neste', 'POST', payload);
}
export async function plukkOppgaveClient(oppgaveId: number, versjon: number) {
  const payload: PlukkOppgaveDto = { oppgaveId, versjon };
  return await clientFetchV2<Oppgave>('/oppgave/api/oppgave/plukk-oppgave', 'POST', payload);
}
