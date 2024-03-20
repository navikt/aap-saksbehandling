import { isLocal } from 'lib/utils/environment';
import { headers } from 'next/headers';
import { getAccessTokenOrRedirectToLogin } from 'lib/auth/authentication';
import { validerToken } from 'lib/services/azureuserservice/azuread';

export interface BrukerInformasjon {
  navn: string;
}

export const hentBrukerInformasjon = async (): Promise<BrukerInformasjon> => {
  if (isLocal()) {
    return { navn: 'Iren Panikk' };
  }
  const requestHeaders = headers();
  const token = getAccessTokenOrRedirectToLogin(requestHeaders);

  const JWTVerifyResult = await validerToken(token);
  return { navn: JWTVerifyResult.payload.name as string };
};
