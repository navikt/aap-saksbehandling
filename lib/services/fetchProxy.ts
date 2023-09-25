import { grantAzureOboToken, isInvalidTokenSet } from '@navikt/next-auth-wonderwall';
import { isLocal } from 'lib/utils/environment';

export const fetchProxy = async <ResponseBody>(
  url: string,
  accessToken: string,
  scope: string,
  method: 'GET' | 'POST' = 'GET',
  requestBody?: object,
  parseBody?: boolean
): Promise<ResponseBody | undefined> => {
  /* TODO: Implementere feilhåndtering +++ */
  if (isLocal()) {
    const response = await fetch(url, {
      method,
      body: JSON.stringify(requestBody),
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json',
      },
    });

    console.log('status', { status: response.status, url });

    if (!response.ok) {
      const responseBody = await response.text();
      console.log('responseBody', responseBody);
      throw new Error(`Unable to fetch ${url}: ${response.statusText}`);
    }

    if (parseBody) {
      return await response.json();
    }
    return undefined;
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
      Accept: 'application/json',
      'Content-Type': 'application/json',
    },
  });

  if (!response.ok) {
    throw new Error(`Unable to fetch ${url}: ${response.statusText}`);
  }

  if (parseBody) {
    return await response.json();
  }
  return undefined;
};
