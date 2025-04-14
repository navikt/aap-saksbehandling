// Postmottak

import { clientFetch, clientFetchV2 } from 'lib/clientApi';
import { LøsAvklaringsbehovPåBehandling, SettPåVentRequest } from 'lib/types/postmottakTypes';

// TODO: Test-endepunkt - skal fjernes
export function postmottakOpprettBehandlingClient(journalpostId: number) {
  return clientFetch<{ referanse: number }>('/postmottak/api/test/behandling/opprett/', 'POST', {
    referanse: journalpostId,
  });
}

export function postmottakSettPåVentClient(behandlingsreferanse: string, body: SettPåVentRequest) {
  return clientFetchV2(`/postmottak/api/post/${behandlingsreferanse}/sett-pa-vent/`, 'POST', body);
}

export function postmottakLøsBehovClient(avklaringsBehov: LøsAvklaringsbehovPåBehandling) {
  return clientFetchV2<void>('/postmottak/api/post/los-behov/', 'POST', avklaringsBehov);
}

export function postmottakEndreTemaClient(behandlingsreferanse: string): Promise<string | undefined> {
  return clientFetch<{ redirectUrl: string }>(
    `/postmottak/api/post/${behandlingsreferanse}/endre-tema`,
    'POST',
    {}
  ).then((resp) => resp?.redirectUrl);
}

export function postmottakHentDokumentClient(journalpostId: number, dokumentInfoId: string): Promise<Blob> {
  return fetch(`/postmottak/api/post/dokumenter/${journalpostId}/${dokumentInfoId}`, { method: 'GET' }).then((res) =>
    res.blob()
  );
}
