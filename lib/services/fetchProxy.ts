import { isLocal } from 'lib/utils/environment';
import { requestOboToken } from '@navikt/oasis';
import { getAccessToken } from 'lib/auth/authentication';
import { headers } from 'next/headers';
import { logError } from '@navikt/aap-felles-utils';

const NUMBER_OF_RETRIES = 3;

export const fetchProxy = async <ResponseBody>(
  url: string,
  scope: string,
  method: 'GET' | 'POST' = 'GET',
  requestBody?: object
): Promise<ResponseBody> => {
  let oboToken;
  if (!isLocal()) {
    const token = getAccessToken(headers());
    logError(`token ${token}`);
    oboToken = await requestOboToken(token, scope);
    if (!oboToken.ok) {
      throw new Error(`Unable to get accessToken: ${oboToken.error}`);
    }
  }

  return await fetchWithRetry<ResponseBody>(url, method, oboToken?.token ?? '', NUMBER_OF_RETRIES, requestBody);
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

  logError(`obotoken ${oboToken}`);

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
      const responseJson = await response.json();
      console.log('errorMessage in fetchWithRetry', responseJson);
      throw new Error(`Unable to fetch ${url}: ${responseJson.message}`);
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
