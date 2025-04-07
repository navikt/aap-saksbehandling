'use server';

import { isLocal } from 'lib/utils/environment';
import { requestAzureOboToken, validateToken } from '@navikt/oasis';
import { headers } from 'next/headers';
import { hentLocalToken } from 'lib/services/localFetch';
import { getAccessTokenOrRedirectToLogin } from './azure/azuread';
import { logError } from 'lib/serverutlis/logger';

export enum ApiExceptionCode {
  INTERNFEIL,
  UKJENT_FEIL,
  IKKE_FUNNET,
  ENDEPUNKT_IKKE_FUNNET,
  UGYLDIG_FORESPØRSEL,
}

interface ApiException {
  status: number;
  code: ApiExceptionCode;
  message: String;
  cause?: string;
}

export type FetchResponse<RespponseType> = SuccessResponseBody<RespponseType> | ErrorResponseBody;

export interface ErrorResponseBody {
  type: 'ERROR';
  apiException: ApiException;
}

interface SuccessResponseBody<ResponseType> {
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
  const oboToken = isLocal() ? await hentLocalToken(scope) : await getOnBefalfOfToken(scope, url);
  return await fetchWithRetry<ResponseType>(url, method, oboToken, NUMBER_OF_RETRIES, requestBody, tags);
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

export const fetchWithRetry = async <ResponseType>(
  url: string,
  method: string,
  oboToken: string,
  retries: number,
  requestBody?: object,
  tags?: string[],
  errors?: string[]
): Promise<FetchResponse<ResponseType>> => {
  if (!errors) errors = [];

  if (retries === 0) {
    logError(`Unable to fetch ${url}: `, Error(errors.join('\n')));
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

  if (response.status === 204) {
    return { type: 'SUCCESS', responseJson: undefined as ResponseType };
  }

  if (!response.ok) {
    if (response.status === 500) {
      const responseJson: ApiException = await response.json();

      logError(`klarte ikke å hente ${url}: ${responseJson.message}`);
      return { type: 'ERROR', apiException: responseJson };
    }

    errors.push(`HTTP ${response.status} ${response.statusText}: ${url} (retries left ${retries})`);

    return await fetchWithRetry(url, method, oboToken, retries - 1, requestBody, tags, errors);
  }

  const contentType = response.headers.get('content-type');
  if (contentType && contentType.includes('text')) {
    return { type: 'SUCCESS', responseJson: response.text() as ResponseType };
  }

  const responseJson: ResponseType = await response.json();

  return { type: 'SUCCESS', responseJson: responseJson };
};
