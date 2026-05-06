import 'server-only';

import { createRemoteJWKSet, jwtVerify } from 'jose';
import { isLocal } from 'lib/utils/environment';
import { getToken } from '@navikt/oasis';
import { redirect } from 'next/navigation';
import { buildOAuthLoginUrl } from 'lib/services/azure/redirectUtils';

let _remoteJWKSet: ReturnType<typeof createRemoteJWKSet>;

export async function validerToken(token: string | Uint8Array) {
  const issuer = process.env.AZURE_OPENID_CONFIG_ISSUER;
  if (!issuer) throw new Error('Miljøvariabelen "AZURE_OPENID_CONFIG_ISSUER" må være satt');

  return jwtVerify(token, await jwks(), {
    issuer: issuer,
  });
}

async function jwks() {
  if (typeof _remoteJWKSet === 'undefined') {
    _remoteJWKSet = createRemoteJWKSet(new URL(process.env.AZURE_OPENID_CONFIG_JWKS_URI as string));
  }

  return _remoteJWKSet;
}

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
