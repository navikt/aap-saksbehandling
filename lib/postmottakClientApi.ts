// Postmottak

import { clientFetch } from 'lib/clientApi';
import {
  LøsAvklaringsbehovPåBehandling,
  SettPåVentRequest,
  BehandlingFlytOgTilstand,
  FinnBehandlingerRespons,
  SimulerJournalpostHendelseRequest,
  JournalposterRespons,
} from 'lib/types/postmottakTypes';

// TODO: Test-endepunkt - skal fjernes
export function postmottakOpprettBehandlingClient(journalpostId: number) {
  return clientFetch<{ referanse: number }>('/postmottak/api/test/behandling/opprett/', 'POST', {
    referanse: journalpostId,
  });
}

/**
 * Kun for lokal testing: simulerer en journalføringshendelse fra Kafka mot postmottak sin TestApp.
 */
export function postmottakSimulerJournalpostHendelseClient(body: SimulerJournalpostHendelseRequest) {
  return clientFetch<void>('/postmottak/api/test/simuler-journalpost-hendelse/', 'POST', body);
}

export function postmottakSettPåVentClient(behandlingsreferanse: string, body: SettPåVentRequest) {
  return clientFetch(`/postmottak/api/post/${behandlingsreferanse}/sett-pa-vent/`, 'POST', body);
}

export function postmottakLøsBehovClient(avklaringsBehov: LøsAvklaringsbehovPåBehandling) {
  return clientFetch<void>('/postmottak/api/post/los-behov/', 'POST', avklaringsBehov);
}

export function postmottakAlleBehandlinger(ident: string) {
  return clientFetch<FinnBehandlingerRespons>(`/postmottak/api/post/alle-behandlinger`, 'POST', { ident: ident });
}

export async function postmottakHentDokumentClient(
  journalpostId: string | number,
  dokumentInfoId: string,
  signal?: AbortSignal
): Promise<Blob> {
  const res = await fetch(
    `/postmottak/api/post/dokumenter/${encodeURIComponent(journalpostId)}/${encodeURIComponent(dokumentInfoId)}`,
    { method: 'GET', signal }
  );
  if (!res.ok) {
    throw new Error(`Kunne ikke hente dokumentet (HTTP ${res.status}).`);
  }
  return res.blob();
}

export function postmottakHentJournalposterClient(behandlingsreferanse: string, etter?: string) {
  const query = new URLSearchParams();
  if (etter) query.set('etter', etter);
  return clientFetch<JournalposterRespons>(
    `/postmottak/api/post/${behandlingsreferanse}/journalposter?${query}`,
    'GET'
  );
}

export function postmottakHentFlyt(behandlingsreferanse: string) {
  return clientFetch<BehandlingFlytOgTilstand>(`/postmottak/api/post/${behandlingsreferanse}/flyt`, 'GET');
}
