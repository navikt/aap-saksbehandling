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
  let oboToken;
  if (!isLocal()) {
    oboToken = await grantAzureOboToken(accessToken, scope);
    if (isInvalidTokenSet(oboToken)) {
      throw new Error(`Unable to get accessToken: ${oboToken.message}`);
    }
  }

  /* TODO: Implementere feilhåndtering +++ */

  const response = await fetch(url, {
    method,
    body: JSON.stringify(requestBody),
    headers: {
      Authorization: `Bearer ${oboToken}`,
      Accept: 'application/json',
      'Content-Type': 'application/json',
    },
  });

  // Mulige feilmeldinger:
  // 500

  console.log('status', { status: response.status, url });

  if (!response.ok) {
    if (response.status === 500) {
      throw new Error(`Unable to fetch ${url}: ${response.statusText}`);
    }
    const responseBody = await response.text();
    console.log('responseBody', responseBody);
    throw new Error(`Unable to fetch ${url}: ${response.statusText}`);
  }

  if (parseBody) {
    return await response.json();
  }
  return undefined;
};
