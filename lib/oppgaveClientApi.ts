import {
  AvklaringsbehovReferanse,
  Kø,
  NesteOppgaveRequestBody,
  NesteOppgaveResponse,
  Oppgave,
  OppgaveAvklaringsbehovKode,
  OppgaveBehandlingstype,
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

type ClientFetch<T> =
  | { type: 'loading' }
  | { type: 'success'; data: T }
  | { type: 'error'; status: number; message: string };
export async function clientFetcher<ResponseBody>(
  url: string,
  method: 'GET' | 'POST' | 'PATCH' | 'DELETE',
  body?: object
): Promise<ClientFetch<ResponseBody>> {
  try {
    const res = await fetch(url, {
      method,
      body: body && JSON.stringify(body),
    });

    if (res.ok) {
      const data: ResponseBody = await res.json();
      return { type: 'success', data };
    } else {
      return {
        type: 'error',
        status: res.status,
        message: res.statusText,
      };
    }
  } catch (e: any) {
    return {
      type: 'error',
      status: 5000,
      message: e?.message,
    };
  }
}

// statistikk
export async function antallÅpneBehandlingerPerBehandlingstypeClient(url: string) {
  return clientFetcher<Array<AntallÅpneOgGjennomsnitt>>(url, 'GET');
}

export async function behandlingerUtviklingClient(url: string) {
  return clientFetcher<Array<BehandlingEndringerPerDag>>(url, 'GET');
}

export async function fordelingÅpneBehandlingerClient(url: string) {
  return clientFetcher<Array<FordelingÅpneBehandlinger>>(url, 'GET');
}

export async function fordelingLukkedeBehandlingerClient(url: string) {
  return clientFetcher<Array<FordelingLukkedeBehandlinger>>(url, 'GET');
}

export async function venteÅrsakerClient(url: string) {
  return clientFetcher<Array<VenteÅrsakOgGjennomsnitt>>(url, 'GET');
}

export async function behandlingerPerSteggruppeClient(url: string) {
  return clientFetcher<Array<BehandlingPerSteggruppe>>(url, 'GET');
}

export async function årsakTilBehandlingClient(url: string) {
  return clientFetcher<Array<BehandlingÅrsakAntallGjennomsnitt>>(url, 'GET');
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

export async function oppgavesokClient(
  avklaringsbehovKoder: OppgaveAvklaringsbehovKode[],
  behandlingstyper: OppgaveBehandlingstype[],
  enheter: string[]
) {
  return clientFetcher<Oppgave[]>('/oppgave/api/oppgave/oppgavesok', 'POST', {
    avklaringsbehovKoder,
    behandlingstyper,
    enheter,
  });
}

// export async function lagOppgaveFilterClient(
//   avklaringsbehovKoder: AvklaringsbehovKode[],
//   behandlingstyper: OppgaveBehandlingstype[],
//   enheter: string[],
//   navn: string,
//   beskrivelse: string
// ) {
//   const payload: Kø = {
//     avklaringsbehovKoder,
//     behandlingstyper,
//     enheter,
//     navn,
//     beskrivelse,
//   };
//   return clientFetcher('/api/oppgave/filter', 'POST', { avklaringsbehovKoder });
// }

export async function plukkNesteOppgaveClient(filterId: number, aktivEnhet: string) {
  const payload: NesteOppgaveRequestBody = { filterId, enheter: [aktivEnhet || ''] };
  return await clientFetchV2<NesteOppgaveResponse>('/oppgave/api/oppgave/neste', 'POST', payload);
}
export async function plukkOppgaveClient(oppgaveId: number, versjon: number) {
  const payload: PlukkOppgaveDto = { oppgaveId, versjon };
  return await clientFetchV2<Oppgave>('/oppgave/api/oppgave/plukk-oppgave', 'POST', payload);
}
