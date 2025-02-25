'use server';

import { isLocal } from 'lib/utils/environment';
import { requestAzureOboToken, validateToken } from '@navikt/oasis';
import { getAccessTokenOrRedirectToLogin, logError } from '@navikt/aap-felles-utils';
import { headers } from 'next/headers';
import { hentLocalToken } from 'lib/services/saksbehandlingservice/saksbehandlingService';
import { redirect } from 'next/navigation';

export type FetchResponse<RespponseType> = SuccessResponseBody<RespponseType> | ErrorResponseBody;

export interface BaseErrorResponseBody {
  status: number;
}

export interface ErrorResponseBody extends BaseErrorResponseBody {
  type: 'ERROR';
  message: string;
}

interface SuccessResponseBody<ResponseType> extends BaseErrorResponseBody {
  type: 'SUCCESS';
  responseJson: ResponseType;
}

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

export const apiFetch = async <ResponseType>(
  url: string,
  scope: string,
  method: 'GET' | 'POST' | 'PUT' | 'PATCH' | 'DELETE' = 'GET',
  requestBody?: object,
  tags?: string[]
): Promise<FetchResponse<ResponseType>> => {
  const oboToken = isLocal() ? await hentLocalToken() : await getOnBefalfOfToken(scope, url);
  return await fetchWithRetry<ResponseType>(url, method, oboToken, NUMBER_OF_RETRIES, requestBody, tags);
};

export const fetchPdf = async (url: string, scope: string): Promise<Blob | undefined> => {
  const oboToken = isLocal() ? await hentLocalToken() : await getOnBefalfOfToken(scope, url);
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

export const fetchWithRetry = async <ResponseType>(
  url: string,
  method: string,
  oboToken: string,
  retries: number,
  requestBody?: object,
  tags?: string[]
): Promise<FetchResponse<ResponseType>> => {
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
    next: { revalidate: 0, tags },
  });

  // Mulige statuskoder:
  // 200
  // 204
  // 404
  // 500

  if (response.status === 204) {
    return { type: 'SUCCESS', responseJson: undefined as ResponseType, status: response.status };
  }

  if (!response.ok) {
    if (response.status === 500) {
      const responseJson = await response.json();
      logError(`klarte ikke å hente ${url}: ${responseJson.message}`);
      return { type: 'ERROR', message: 'Noe gikk galt.', status: response.status };
    } else if (response.status === 401 || response.status === 403) {
      logError(`${url}, status: ${response.status}`);
      redirect(`/forbidden?url=${encodeURI(url)}`);
    } else if (response.status === 404) {
      logError(`${url}, status: ${response.status}`);
      return { type: 'ERROR', message: 'Not found', status: response.status };
    } else if (response.status === 409) {
      logError(`${url}, status: ${response.status}`);
      return { type: 'ERROR', message: 'Conflict', status: response.status };
    }

    logError(
      `Kall mot ${url} feilet med statuskode ${response.status}, prøver på nytt. Antall forsøk igjen: ${retries}`
    );
    return await fetchWithRetry(url, method, oboToken, retries - 1, requestBody, tags);
  }

  const contentType = response.headers.get('content-type');
  if (contentType && contentType.includes('text')) {
    return { type: 'SUCCESS', responseJson: response.text() as ResponseType, status: response.status };
  }

  const responseJson = await response.json();

  return { type: 'SUCCESS', responseJson: responseJson, status: response.status };
};
