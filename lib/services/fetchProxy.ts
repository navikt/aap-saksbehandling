import { isLocal } from 'lib/utils/environment';
import { requestAzureOboToken, validateToken } from '@navikt/oasis';
import { getAccessTokenOrRedirectToLogin } from 'lib/auth/authentication';
import { headers } from 'next/headers';
import { logError } from '@navikt/aap-felles-utils';

const NUMBER_OF_RETRIES = 3;

export const getOnBefalfOfToken = async (audience: string, url: string): Promise<string> => {
  const token = getAccessTokenOrRedirectToLogin(headers());
  if (!token) {
    logError(`Token for ${url} er undefined`);
    throw new Error('Token for simpleTokenXProxy is undefined');
  }

  const validation = await validateToken(token);
  if (!validation.ok) {
    logError(`Token for ${url} validerte ikke`);
    throw new Error('Token for simpleTokenXProxy didnt validate');
  }

  const onBehalfOf = await requestAzureOboToken(token, audience);
  if (!onBehalfOf.ok) {
    logError(`Henting av oboToken for ${url} feilet`, onBehalfOf.error);
    throw new Error('Request oboToken for simpleTokenXProxy failed');
  }

  return onBehalfOf.token;
};

export const fetchProxy = async <ResponseBody>(
  url: string,
  scope: string,
  method: 'GET' | 'POST' = 'GET',
  requestBody?: object
): Promise<ResponseBody> => {
  if (isLocal()) {
    return await fetchWithRetry<ResponseBody>(url, method, 'lokaltoken', NUMBER_OF_RETRIES, requestBody);
  } else {
    const oboToken = await getOnBefalfOfToken(scope, url);
    return await fetchWithRetry<ResponseBody>(url, method, oboToken, NUMBER_OF_RETRIES, requestBody);
  }
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
      const responseJson = await response.json();
      logError(`klarte ikke å hente ${url}: ${responseJson.message}`);
      throw new Error(`Unable to fetch ${url}: ${responseJson.message}`);
    }
    if (response.status === 404) {
      throw new Error(`Ikke funnet: ${url}`);
    }

    logError(
      `Kall mot ${url} feilet med statuskode ${response.status}, prøver på nytt. Antall forsøk igjen: ${retries}`
    );
    return await fetchWithRetry(url, method, oboToken, retries - 1, requestBody);
  }

  return await response.json();
};
