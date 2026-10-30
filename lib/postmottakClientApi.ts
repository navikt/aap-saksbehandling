// Postmottak

import { clientFetch } from 'lib/clientApi';
import {
  LøsAvklaringsbehovPåBehandling,
  SettPåVentRequest,
  BehandlingFlytOgTilstand,
  FinnBehandlingerRespons,
  FinnBehandlingerRequest,
  OpprettPostmottakBehandlingRequest,
  OpprettPostmottakBehandlingResponse,
} from 'lib/types/postmottakTypes';

// TODO: Test-endepunkt - skal fjernes
export function postmottakOpprettBehandlingClient(journalpostId: number) {
  return clientFetch<OpprettPostmottakBehandlingResponse>('/postmottak/api/test/behandling/opprett/', 'POST', {
    referanse: journalpostId,
  } satisfies OpprettPostmottakBehandlingRequest);
}

export function postmottakSettPåVentClient(behandlingsreferanse: string, body: SettPåVentRequest) {
  return clientFetch(`/postmottak/api/post/${behandlingsreferanse}/sett-pa-vent/`, 'POST', body);
}

export function postmottakLøsBehovClient(avklaringsBehov: LøsAvklaringsbehovPåBehandling) {
  return clientFetch<void>('/postmottak/api/post/los-behov/', 'POST', avklaringsBehov);
}

export function postmottakAlleBehandlinger(ident: string) {
  return clientFetch<FinnBehandlingerRespons>(`/postmottak/api/post/alle-behandlinger`, 'POST', {
    ident: ident,
  } satisfies FinnBehandlingerRequest);
}

export async function postmottakHentDokumentClient(journalpostId: number, dokumentInfoId: string): Promise<Blob> {
  return fetch(`/postmottak/api/post/dokumenter/${journalpostId}/${dokumentInfoId}`, { method: 'GET' }).then((res) =>
    res.blob()
  );
}

export function postmottakHentFlyt(behandlingsreferanse: string) {
  return clientFetch<BehandlingFlytOgTilstand>(`/postmottak/api/post/${behandlingsreferanse}/flyt`, 'GET');
}
