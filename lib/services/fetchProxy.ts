import { grantAzureOboToken, isInvalidTokenSet } from '@navikt/next-auth-wonderwall';
import { isLocal } from 'lib/utils/environment';

export const fetchProxy = async <ResponseBody>(
  url: string,
  accessToken: string,
  scope: string,
  method: 'GET' | 'POST' = 'GET',
  requestBody?: object
): Promise<ResponseBody> => {
  /* TODO: Implementere feilhåndtering +++ */
  if (isLocal()) {
    const response = await fetch(url, {
      method,
      body: JSON.stringify(requestBody),
    });
    return await response.json();
  }

  const oboToken = await grantAzureOboToken(accessToken, scope);
  if (isInvalidTokenSet(oboToken)) {
    throw new Error(`Unable to get accessToken: ${oboToken.message}`);
  }

  const response = await fetch(url, {
    method,
    body: JSON.stringify(requestBody),
    headers: {
      Authorization: `Bearer ${oboToken}`,
    },
  });

  if (!response.ok) {
    throw new Error(`Unable to fetch ${url}: ${response.statusText}`);
  }

  const data = await response.json();
  return data;
};
