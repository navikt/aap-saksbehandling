'use server';

import { isLocal } from 'lib/utils/environment';
import { requestAzureOboToken, validateToken } from '@navikt/oasis';
import { headers } from 'next/headers';
import { hentLocalToken } from 'lib/services/localFetch';
import { getAccessTokenOrRedirectToLogin } from './azure/azuread';
import { logError, logWarning } from 'lib/serverutlis/logger';
import { ApiException, FetchResponse } from 'lib/utils/api';

const NUMBER_OF_RETRIES = 3;
const lokalFakeObotoken = isLocal();

const getAzureOboToken = async (token: string, audience: string, url: string, retries: number) => {
  const onBehalfOf = await requestAzureOboToken(token, audience);

  if (onBehalfOf.ok) {
    return onBehalfOf.token;
  }

  logWarning(`Henting av oboToken for ${url} feilet`, onBehalfOf.error);

  if (retries === 0) {
    throw new Error(`Henting av oboToken for ${url} feilet etter ${NUMBER_OF_RETRIES} forsøk`);
  }
  return await getAzureOboToken(token, audience, url, retries - 1);
};

const getToken = async (audience: string, url: string): Promise<string> => {
  const token = getAccessTokenOrRedirectToLogin(await headers());
  if (!token) {
    logError(`Token for ${url} mangler (undefined, null eller tom)`);
    throw new Error('Token mangler (undefined, null eller tom)');
  }

  const validation = await validateToken(token);
  if (!validation.ok) {
    logError(`Token for ${url} validerte ikke`);
    throw new Error('Token validerte ikke');
  }

  return getAzureOboToken(token, audience, url, NUMBER_OF_RETRIES);
};

export const apiFetch = async <ResponseType>(
  url: string,
  scope: string,
  method: 'GET' | 'POST' | 'PUT' | 'PATCH' | 'DELETE' = 'GET',
  requestBody?: object,
  tags?: string[]
): Promise<FetchResponse<ResponseType>> => {
  const oboToken = lokalFakeObotoken ? await hentLocalToken(scope) : await getToken(scope, url);
  return await fetchWithRetry<ResponseType>(url, method, oboToken, NUMBER_OF_RETRIES, requestBody, tags);
};

export const apiFetchNoMemoization = async <ResponseType>(
  url: string,
  scope: string,
  method: 'GET' | 'POST' | 'PUT' | 'PATCH' | 'DELETE' = 'GET',
  requestBody?: object,
  tags?: string[]
): Promise<FetchResponse<ResponseType>> => {
  const oboToken = lokalFakeObotoken ? await hentLocalToken(scope) : await getToken(scope, url);
  // Brukes for å gi signal om og unngå bruk av request memoization. Se https://nextjs.org/docs/app/deep-dive/caching#request-memoization
  const abortSignal = new AbortController().signal;
  return await fetchWithRetry<ResponseType>(url, method, oboToken, NUMBER_OF_RETRIES, requestBody, tags, abortSignal);
};

const fetchWithRetry = async <ResponseType>(
  url: string,
  method: string,
  oboToken: string,
  retries: number,
  requestBody?: object,
  tags?: string[],
  signal?: AbortSignal,
  errors?: string[]
): Promise<FetchResponse<ResponseType>> => {
  if (!errors) errors = [];

  if (retries === 0) {
    logError(`Unable to fetch ${url}: `, Error(errors.join('\n')));
  }

  const options: RequestInit = {
    method,
    body: JSON.stringify(requestBody),
    headers: {
      Authorization: `Bearer ${oboToken}`,
      Accept: 'application/json',
      'Content-Type': 'application/json',
    },
    next: { revalidate: 0, tags },
    signal: signal,
  };

  const response = await fetch(url, options);

  if (response.status === 204) {
    return { type: 'SUCCESS', status: response.status, data: undefined as ResponseType };
  }

  if (!response.ok) {
    const shouldRetry = false;
    if (shouldRetry) {
      errors.push(`HTTP ${response.status} ${response.statusText}: ${url} (retries left ${retries})`);
      return await fetchWithRetry(url, method, oboToken, retries - 1, requestBody, tags, signal, errors);
    }

    const responseJson: ApiException = await response.json();
    const feilmelding = `klarte ikke å hente ${url}: ${responseJson.message} med status ${response.status}`;
    if (response.status >= 500) {
      logError(feilmelding);
    } else {
      logWarning(feilmelding);
    }
    return { type: 'ERROR', apiException: responseJson, status: response.status };
  }

  const contentType = response.headers.get('content-type');
  if (contentType && contentType.includes('text')) {
    return { type: 'SUCCESS', status: response.status, data: (await response.text()) as ResponseType };
  }

  const responseJson: ResponseType = await response.json();

  return { type: 'SUCCESS', status: response.status, data: responseJson };
};

export const apiFetchPdf = async (url: string, scope: string): Promise<Blob | undefined> => {
  const oboToken = lokalFakeObotoken ? await hentLocalToken(scope) : await getToken(scope, url);
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
