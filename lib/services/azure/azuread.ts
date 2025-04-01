import { Client, Issuer } from 'openid-client';
import { JWSHeaderParameters, jwtVerify, createRemoteJWKSet, FlattenedJWSInput } from 'jose';
import { GetKeyFunction } from 'jose/dist/types/types';
import { isLocal } from 'lib/utils/environment';
import { getToken } from '@navikt/oasis';
import { redirect } from 'next/navigation';

let _issuer: Issuer<Client>;
let _remoteJWKSet: GetKeyFunction<JWSHeaderParameters, FlattenedJWSInput>;

export async function validerToken(token: string | Uint8Array) {
  return jwtVerify(token, await jwks(), {
    issuer: (await issuer()).metadata.issuer,
  });
}

async function jwks() {
  if (typeof _remoteJWKSet === 'undefined') {
    _remoteJWKSet = createRemoteJWKSet(new URL(process.env.AZURE_OPENID_CONFIG_JWKS_URI as string));
  }

  return _remoteJWKSet;
}

async function issuer() {
  if (typeof _issuer === 'undefined') {
    if (!process.env.AZURE_APP_WELL_KNOWN_URL)
      throw new Error(`Miljøvariabelen "AZURE_APP_WELL_KNOWN_URL" må være satt`);
    _issuer = await Issuer.discover(process.env.AZURE_APP_WELL_KNOWN_URL);
  }
  return _issuer;
}

export function getAccessTokenOrRedirectToLogin(headers: Headers): string {
  if (isLocal()) return 'fake-token';

  const redirectPath = headers.get('x-path');
  const token = getToken(headers);
  if (!token) {
    redirect(`/oauth2/login?redirect=${redirectPath}`);
  }

  return token;
}
