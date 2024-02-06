import { validerToken } from './azuread';
import { isLocal } from 'lib/utils/environment';

export interface BrukerInformasjon {
  navn: string;
}

export const hentBrukerInformasjon = async (token: string): Promise<BrukerInformasjon> => {
  if (isLocal()) {
    return { navn: 'Iren Panikk' };
  }

  const JWTVerifyResult = await validerToken(token);
  return { navn: JWTVerifyResult.payload.name as string };
};
