import { isLocal } from 'lib/utils/environment';
import { headers } from 'next/headers';
import { redirect } from 'next/navigation';
import { getToken, validateAzureToken } from '@navikt/oasis';
import { logWarning } from '@navikt/aap-felles-utils';

export async function verifyUserLoggedIn(): Promise<void> {
  const requestHeaders = headers();

  if (process.env.NEXT_PUBLIC_ENVIRONMENT === 'localhost') {
    console.log('Running locally, skipping authentication');
    return;
  }
  const redirectPath = requestHeaders.get('x-path');

  const token = getAccessTokenOrRedirectToLogin(requestHeaders);

  const validationResult = await validateAzureToken(token);
  if (!validationResult.ok) {
    logWarning('validateAzureToken', validationResult.error);

    redirect(`${process.env.NEXT_PUBLIC_BASE_PATH ?? ''}/oauth2/login?redirect=${redirectPath}`);
  }
}

export function getAccessTokenOrRedirectToLogin(headers: Headers): string {
  if (isLocal()) return 'fake-token';

  const redirectPath = headers.get('x-path');
  const token = getToken(headers);
  if (!token) {
    redirect(`${process.env.NEXT_PUBLIC_BASE_PATH}/oauth2/login?redirect=${redirectPath}`);
  }

  return token;
}
