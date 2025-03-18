import { fetchProxy } from 'lib/services/fetchProxy';
import { isLocal } from 'lib/utils/environment';

const tilgangApiBaseUrl = process.env.TILGANG_API_BASE_URL;
const tilgangApiScope = process.env.TILGANG_API_SCOPE ?? '';

export async function sjekkTilgang(behandlingsreferanse: string, avklaringsbehovKode: string) {
  if (isLocal()) {
    return { tilgang: false };
  }
  const url = `${tilgangApiBaseUrl}/tilgang/behandling`;
  return fetchProxy<{ tilgang: boolean }>(url, tilgangApiScope, 'POST', {
    avklaringsbehovKode,
    behandlingsreferanse,
    operasjon: 'SAKSBEHANDLE',
  });
}
