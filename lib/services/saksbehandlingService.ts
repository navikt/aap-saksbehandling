import { grantAzureOboToken, isInvalidTokenSet } from '@navikt/next-auth-wonderwall';
import { DetaljertBehandling } from 'lib/types/types';
import { isLocal } from 'lib/utils/environment';

const saksbehandlingApiBaseUrl = process.env.BEHANDLING_API_BASE_URL;
const saksbehandlingScope = process.env.BEHANDLING_API_SCOPE ?? '';

export const hentBehandling = async (
  behandlingsReferanse: string,
  accesToken: string
): Promise<DetaljertBehandling | undefined> => {
  const url = `${saksbehandlingApiBaseUrl}/api/behandling/hent/${behandlingsReferanse}`;
  if (isLocal()) {
    const response = await fetch(url);
    return await response.json();
  }

  const oboToken = await grantAzureOboToken(accesToken, saksbehandlingScope);
  if (isInvalidTokenSet(oboToken)) {
    throw new Error(`Unable to get accessToken: ${oboToken.message}`);
  }

  const response = await fetch(url, {
    headers: {
      Authorization: `Bearer ${oboToken}`,
    },
  });

  const data = await response.json();
  return data;
};
