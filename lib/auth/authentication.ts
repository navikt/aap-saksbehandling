//import { logger } from '@navikt/aap-felles-utils';
import { validateAzureToken } from '@navikt/next-auth-wonderwall';
import { isLocal } from 'lib/utils/environment';
import { headers } from 'next/headers';
import { redirect } from 'next/navigation';

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

  const bearerToken = requestHeaders.get('Authorization');
  if (!bearerToken) {
    redirect(`${process.env.NEXT_PUBLIC_BASE_PATH}/oauth2/login?redirect=${redirectPath}`);
  }

  const validationResult = await validateAzureToken(bearerToken);
  if (validationResult !== 'valid') {
    // const error = new Error(
    //   `Invalid JWT token found (cause: ${validationResult.errorType} ${validationResult.message}, redirecting to login.`,
    //   { cause: validationResult.error }
    // );
    //logger.warn(error);

    redirect(`${process.env.NEXT_PUBLIC_BASE_PATH ?? ''}/oauth2/login?redirect=${redirectPath}`);
  }
}

export function getToken(headers: Headers): string {
  if (isLocal()) return 'fake-token';

  return headers.get('authorization')?.replace('Bearer ', '') ?? ''; // TODO: Bedre håndtering av token
}
