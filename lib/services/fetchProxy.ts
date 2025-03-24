'use server';

import { isLocal } from 'lib/utils/environment';
import { requestAzureOboToken, validateToken } from '@navikt/oasis';
import { getAccessTokenOrRedirectToLogin, logError, logWarning } from '@navikt/aap-felles-utils';
import { headers } from 'next/headers';
import { redirect } from 'next/navigation';
import { hentLocalToken } from 'lib/services/localFetch';

const NUMBER_OF_RETRIES = 3;

const getOnBefalfOfToken = async (audience: string, url: string): Promise<string> => {
  const token = getAccessTokenOrRedirectToLogin(await headers());
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
  method: 'GET' | 'POST' | 'PUT' | 'PATCH' | 'DELETE' = 'GET',
  requestBody?: object,
  tags?: string[]
): Promise<ResponseBody> => {
  const oboToken = isLocal() ? await hentLocalToken(scope) : await getOnBefalfOfToken(scope, url);
  return await fetchWithRetry<ResponseBody>(url, method, oboToken, NUMBER_OF_RETRIES, requestBody, tags);
};

export const fetchPdf = async (url: string, scope: string): Promise<Blob | undefined> => {
  const oboToken = isLocal() ? await hentLocalToken(scope) : await getOnBefalfOfToken(scope, url);
  const response = await fetch(url, {
    method: 'GET',
    headers: {
      Authorization: `Bearer ${oboToken}`,
      Accept: 'application/pdf',
    },
    next: { revalidate: 0 },
  });

  if (response.ok) {
    return response.blob();
  } else {
    logError(`kunne ikke lese pdf på url ${url}.`);
  }
};

export const fetchWithRetry = async <ResponseBody>(
  url: string,
  method: string,
  oboToken: string,
  retries: number,
  requestBody?: object,
  tags?: string[],
  errors?: string[]
): Promise<ResponseBody> => {
  if (!errors) errors = [];

  if (retries === 0) {
    logError(`Unable to fetch ${url}: \n${errors.join('\n')}`);
    throw new Error(`Feil oppsto ved kall mot ${url}`);
  }

  const response = await fetch(url, {
    method,
    body: JSON.stringify(requestBody),
    headers: {
      Authorization: `Bearer ${oboToken}`,
      Accept: 'application/json',
      'Content-Type': 'application/json',
    },
    next: { revalidate: 0, tags },
  });

  // Mulige statuskoder:
  // 200
  // 204
  // 404
  // 500

  if (response.status === 204) {
    return undefined as ResponseBody;
  }

  if (!response.ok) {
    const statusString = `Status: ${response.status}, statusText: ${response.statusText}`;
    if (response.status === 500) {
      const responseJson = await response.json();
      logError(`klarte ikke å hente ${url}: ${responseJson.message}`);
      throw new Error(statusString);
    } else if (response.status === 401) {
      logError(`${url}, status: ${response.status}`);
      throw new Error(statusString);
    } else if (response.status === 403) {
      logWarning(`${url}, status: ${response.status}`);
      redirect(`/forbidden?url=${encodeURI(url)}`);
    }
    if (response.status === 404) {
      logError(`${url}, status: ${response.status}`);
      throw new Error(statusString);
    }

    errors.push(`HTTP ${response.status} ${response.statusText}: ${url} (retries left ${retries})`);

    return await fetchWithRetry(url, method, oboToken, retries - 1, requestBody, tags, errors);
  }

  const contentType = response.headers.get('content-type');
  if (contentType && contentType.includes('text')) {
    return (await response.text()) as ResponseBody;
  }

  return await response.json();
};
