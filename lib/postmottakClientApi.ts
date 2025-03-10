// Postmottak

import { clientFetch } from 'lib/clientApi';
import { LøsAvklaringsbehovPåBehandling, SettPåVentRequest } from 'lib/types/postmottakTypes';

// TODO: Test-endepunkt - skal fjernes
export function postmottakOpprettBehandlingClient(journalpostId: number) {
  return clientFetch<{ referanse: number }>('/postmottak/api/test/behandling/opprett/', 'POST', {
    referanse: journalpostId,
  });
}

export function postmottakSettPåVentClient(behandlingsreferanse: string, body: SettPåVentRequest) {
  return clientFetch(`/postmottak/api/post/${behandlingsreferanse}/sett-pa-vent/`, 'POST', body);
}

export function postmottakLøsBehovClient(avklaringsBehov: LøsAvklaringsbehovPåBehandling) {
  return clientFetch('/postmottak/api/post/los-behov/', 'POST', avklaringsBehov);
}

export function postmottakEndreTemaClient(behandlingsreferanse: string): Promise<string | undefined> {
  return clientFetch<{ redirectUrl: string }>(
    `/postmottak/api/post/${behandlingsreferanse}/endre-tema`,
    'POST',
    {}
  ).then((resp) => resp?.redirectUrl);
}
