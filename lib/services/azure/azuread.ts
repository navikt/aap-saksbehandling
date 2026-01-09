import { JWSHeaderParameters, jwtVerify, createRemoteJWKSet, FlattenedJWSInput } from 'jose';
import { GetKeyFunction } from 'jose/dist/types/types';
import { isLocal } from 'lib/utils/environment';
import { getToken } from '@navikt/oasis';
import { redirect } from 'next/navigation';

let _issuerMetadata: { issuer: string; jwks_uri: string };
let _remoteJWKSet: GetKeyFunction<JWSHeaderParameters, FlattenedJWSInput>;

export async function validerToken(token: string | Uint8Array) {
  return jwtVerify(token, await jwks(), {
    issuer: (await getIssuerMetadata()).issuer,
  });
}

async function jwks() {
  if (typeof _remoteJWKSet === 'undefined') {
    _remoteJWKSet = createRemoteJWKSet(new URL(process.env.AZURE_OPENID_CONFIG_JWKS_URI as string));
  }

  return _remoteJWKSet;
}

async function getIssuerMetadata() {
  if (!_issuerMetadata) {
    const url = process.env.AZURE_APP_WELL_KNOWN_URL;
    if (!url) throw new Error('Miljøvariabelen "AZURE_APP_WELL_KNOWN_URL" må være satt');

    const res = await fetch(url);
    if (!res.ok) throw new Error(`Klarte ikke hente AzureAD-issuer fra ${url}`);
    _issuerMetadata = await res.json();
  }
  return _issuerMetadata;
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
