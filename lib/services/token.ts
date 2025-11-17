import { requestAzureOboToken, validateToken } from '@navikt/oasis';
import { headers } from 'next/headers';
import { getAccessTokenOrRedirectToLogin } from './azure/azuread';
import { logError, logWarning } from 'lib/serverutlis/logger';
import { hentLocalToken } from 'lib/services/localFetch';
import { isLocal } from 'lib/utils/environment';

const NUMBER_OF_RETRIES = 3;

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

export const getToken = async (audience: string, url: string): Promise<string> => {
  if (isLocal()) {
    return await hentLocalToken(audience);
  }

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
