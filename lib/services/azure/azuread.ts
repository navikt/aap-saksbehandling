import 'server-only';
import { isLocal } from 'lib/utils/environment';
import { getToken } from '@navikt/oasis';
import { redirect } from 'next/navigation';
import { buildOAuthLoginUrl } from 'lib/services/azure/redirectUtils';

const lokalFakeAccessToken = isLocal();
export function getAccessTokenOrRedirectToLogin(headers: Headers): string {
  if (lokalFakeAccessToken) return 'fake-token';

  const redirectPath = headers.get('x-path');
  const token = getToken(headers);
  if (!token) {
    redirect(buildOAuthLoginUrl(redirectPath));
  }

  return token;
}
