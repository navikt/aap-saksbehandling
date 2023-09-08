import { grantAzureOboToken, isInvalidTokenSet } from '@navikt/next-auth-wonderwall';
import { isLocal } from 'lib/utils/environment';

const saksbehandlingApiBaseUrl = process.env.BEHANDLING_API_BASE_URL;
const saksbehandlingScope = process.env.BEHANDLING_API_SCOPE ?? '';

export const hentBehandling = async (behandlingsReferanse: string, accesToken: string) => {
  if (isLocal()) {
    return '';
  }

  const oboToken = await grantAzureOboToken(accesToken, saksbehandlingScope);
  if (isInvalidTokenSet(oboToken)) {
    return {
      errorType: 'AUTHORIZATION',
      message: `Unable to get accessToken: ${oboToken.message}`,
    };
  }

  const url = `${saksbehandlingApiBaseUrl}/api/behandling/hent/${behandlingsReferanse}`;
  const response = await fetch(url, {
    headers: {
      Authorization: `Bearer ${oboToken}`,
    },
  });

  const data = await response.json();
  return data;
};
