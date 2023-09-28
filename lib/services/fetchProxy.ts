import { grantAzureOboToken, isInvalidTokenSet } from '@navikt/next-auth-wonderwall';
import { isLocal } from 'lib/utils/environment';

const NUMBER_OF_RETRIES = 3;

export const fetchProxy = async <ResponseBody>(
  url: string,
  accessToken: string,
  scope: string,
  method: 'GET' | 'POST' = 'GET',
  requestBody?: object
): Promise<ResponseBody> => {
  let oboToken;
  if (!isLocal()) {
    oboToken = await grantAzureOboToken(accessToken, scope);
    if (isInvalidTokenSet(oboToken)) {
      throw new Error(`Unable to get accessToken: ${oboToken.message}`);
    }
  }

  return await fetchWithRetry<ResponseBody>(url, method, oboToken ?? '', NUMBER_OF_RETRIES, requestBody);
};

const fetchWithRetry = async <ResponseBody>(
  url: string,
  method: string,
  oboToken: string,
  retries: number,
  requestBody?: object
): Promise<ResponseBody> => {
  if (retries === 0) {
    throw new Error(`Unable to fetch ${url}: ${retries} retries left`);
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

  // Mulige feilmeldinger:
  // 500
  // 404

  console.log('status', { status: response.status, url });

  if (!response.ok) {
    if (response.status === 500) {
      throw new Error(`Unable to fetch ${url}: ${response.statusText}`);
    }
    if (response.status === 404) {
      throw new Error(`Ikke funnet: ${url}`);
    }

    console.log(
      `Kall mot ${url} feilet med statuskode ${response.status}, prøver på nytt. Antall forsøk igjen: ${retries}`
    );
    return await fetchWithRetry(url, method, oboToken, retries - 1, requestBody);
  }

  return await response.json();
};
