'use server';

import { logError, logWarning } from 'lib/serverutlis/logger';
import { ApiException, FetchResponse } from 'lib/utils/api';
import { getToken } from 'lib/services/token';

const NUMBER_OF_RETRIES = 3;

export const apiFetch = async <ResponseType>(
  url: string,
  scope: string,
  method: 'GET' | 'POST' | 'PUT' | 'PATCH' | 'DELETE' = 'GET',
  requestBody?: object,
  tags?: string[]
): Promise<FetchResponse<ResponseType>> => {
  const oboToken = await getToken(scope, url);
  const options = mapFetchOptions(method, oboToken, requestBody, tags);

  return await fetchWithRetry<ResponseType>(url, options, NUMBER_OF_RETRIES);
};

export const apiFetchNoMemoization = async <ResponseType>(
  url: string,
  scope: string,
  method: 'GET' | 'POST' | 'PUT' | 'PATCH' | 'DELETE' = 'GET',
  requestBody?: object,
  tags?: string[]
): Promise<FetchResponse<ResponseType>> => {
  const oboToken = await getToken(scope, url);
  const options = mapFetchOptions(method, oboToken, requestBody, tags, new AbortController().signal);

  return await fetchWithRetry<ResponseType>(url, options, NUMBER_OF_RETRIES);
};

const fetchWithRetry = async <ResponseType>(
  url: string,
  options: RequestInit,
  retries: number
): Promise<FetchResponse<ResponseType>> => {
  try {
    const response = await fetch(url, options);

    if (response.status === 204) {
      return { type: 'SUCCESS', status: response.status, data: undefined as ResponseType };
    }

    if (!response.ok) {
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
  } catch (error) {
    // Fanger uhåndterte nettverksfeil som f.eks.: ECONNRESET, ETIMEDOUT, osv.
    logWarning(`Nettverksfeil mot ${url}: `, error);

    if (retries > 1 && options.method === 'GET') {
      const delayMs = (NUMBER_OF_RETRIES - retries + 1) * 1000; // Økende delay: 1s, 2s, 3s...
      await new Promise((resolve) => setTimeout(resolve, delayMs));
      return await fetchWithRetry(url, options, retries - 1);
    }

    logError(`For mange nettverksfeil (${options.method} ${url}): `, error);
    return {
      type: 'ERROR',
      apiException: { message: `Fikk ikke svar fra tjenesten. Prøv igjen.` },
      status: 503, // Service Unavailable
    };
  }
};

export const apiFetchPdf = async (url: string, scope: string): Promise<Response> => {
  const oboToken = await getToken(scope, url);

  const response = await fetch(url, {
    method: 'GET',
    headers: {
      Authorization: `Bearer ${oboToken}`,
      Accept: 'application/pdf, application/json',
    },
    next: { revalidate: 0 },
  });

  if (response.ok) {
    return new Response(await response.blob());
  } else {
    logWarning(`kunne ikke lese pdf på url ${url}.`);
    const apiException: ApiException = await response.json();
    return new Response(apiException.message, { status: response.status });
  }
};

const mapFetchOptions = (
  method: string,
  oboToken: string,
  requestBody?: object,
  tags?: string[],
  /**
   * Brukes for å gi signal om og unngå bruk av request memoization.
   * Se https://nextjs.org/docs/app/deep-dive/caching#request-memoization
   **/
  signal?: AbortSignal
): RequestInit => ({
  method,
  body: requestBody ? JSON.stringify(requestBody) : undefined,
  headers: {
    Authorization: `Bearer ${oboToken}`,
    Accept: 'application/json',
    'Content-Type': 'application/json',
  },
  next: { revalidate: 0, tags },
  signal: signal,
});
