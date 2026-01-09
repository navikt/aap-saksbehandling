import { JWSHeaderParameters, jwtVerify, createRemoteJWKSet, FlattenedJWSInput } from 'jose';
import { GetKeyFunction } from 'jose/dist/types/types';
import { isLocal } from 'lib/utils/environment';
import { getToken } from '@navikt/oasis';
import { redirect } from 'next/navigation';

let _remoteJWKSet: GetKeyFunction<JWSHeaderParameters, FlattenedJWSInput>;

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
    redirect(`/oauth2/login?redirect=${redirectPath}`);
  }

  return token;
}
