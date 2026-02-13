import 'server-only';

import { isLocal } from 'lib/utils/environment';
import { apiFetch } from 'lib/services/apiFetch';
import { FetchResponse } from 'lib/utils/api';

const tilgangApiBaseUrl = process.env.TILGANG_API_BASE_URL;
const tilgangApiScope = process.env.TILGANG_API_SCOPE ?? '';

export interface TilgangResponse {
  tilgang: boolean;
}

const lokalFakeTilgangssjekk = isLocal();
export async function sjekkTilgang(
  behandlingsreferanse: string,
  avklaringsbehovKode: string
): Promise<FetchResponse<TilgangResponse>> {
  if (lokalFakeTilgangssjekk) {
    return { data: { tilgang: true }, status: 200, type: 'SUCCESS' };
  }
  const url = `${tilgangApiBaseUrl}/tilgang/behandling`;
  return apiFetch<TilgangResponse>(url, tilgangApiScope, 'POST', {
    avklaringsbehovKode,
    behandlingsreferanse,
    operasjon: 'SAKSBEHANDLE',
  });
}
