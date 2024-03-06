//import { logger } from '@navikt/aap-felles-utils';
// import { validateAzureToken } from '@navikt/next-auth-wonderwall';
import { isLocal } from 'lib/utils/environment';
import { headers } from 'next/headers';
import { redirect } from 'next/navigation';
import { getToken, validateAzureToken } from '@navikt/oasis';

export async function verifyUserLoggedIn(): Promise<void> {
  const requestHeaders = headers();

  if (process.env.NEXT_PUBLIC_ENVIRONMENT === 'localhost') {
    console.log('Running locally, skipping authentication');
    return;
  }

  const redirectPath = requestHeaders.get('x-path');
  if (!redirectPath == null) {
    //logger.warn("Missing 'x-path' header, is middleware middlewaring?");
  }

  const token = getAccessToken(requestHeaders);
  if (!token) {
    redirect(`${process.env.NEXT_PUBLIC_BASE_PATH}/oauth2/login?redirect=${redirectPath}`);
  }

  const validationResult = await validateAzureToken(token);
  if (!validationResult.ok) {
    // const error = new Error(
    //   `Invalid JWT token found (cause: ${validationResult.errorType} ${validationResult.message}, redirecting to login.`,
    //   { cause: validationResult.error }
    // );
    //logger.warn(error);

    redirect(`${process.env.NEXT_PUBLIC_BASE_PATH ?? ''}/oauth2/login?redirect=${redirectPath}`);
  }
}

export function getAccessToken(headers: Headers): string {
  if (isLocal()) return 'fake-token';

  const redirectPath = headers.get('x-path');
  const token = getToken(headers); // TODO: Bedre håndtering av token
  if (!token) {
    redirect(`${process.env.NEXT_PUBLIC_BASE_PATH}/oauth2/login?redirect=${redirectPath}`);
  }

  return token;
}
