import { headers } from 'next/headers';

import { getAccessTokenOrRedirectToLogin, validerToken } from './azuread';
import { isLocal } from 'lib/utils/environment';
import { isDev } from '@navikt/aap-felles-utils';

export interface BrukerInformasjon {
  navn: string;
  NAVident?: string;
}

export async function hentBrukerInformasjon(): Promise<BrukerInformasjon> {
  if (isLocal()) {
    return { navn: 'Iren Panikk', NAVident: 'z123456' };
  }
  const requestHeaders = await headers();
  const token = getAccessTokenOrRedirectToLogin(requestHeaders);

  const JWTVerifyResult = await validerToken(token);
  console.log('hello pello', JWTVerifyResult);
  return { navn: JWTVerifyResult.payload.name as string, NAVident: JWTVerifyResult.payload.NAVident as string };
}

enum Roller {
  BESLUTTER = 'BESLUTTER',
  LES = 'LES',
  SAKSBEHANDLER_OPPFØLGING = 'SAKSBEHANDLER_OPPFØLGING',
  KVALITETSSIKRER = 'KVALITETSSIKRER',
  SAKSBEHANDLER_NASJONAL = 'SAKSBEHANDLER_NASJONAL',
  DRIFT = 'DRIFT',
  PRODUKSJONSSTYRING = 'PRODUKSJONSSTYRING',
}
export async function hentRollerForBruker(): Promise<Roller[]> {
  if (isLocal()) {
    return [
      Roller.BESLUTTER,
      Roller.KVALITETSSIKRER,
      Roller.LES,
      Roller.SAKSBEHANDLER_NASJONAL,
      Roller.SAKSBEHANDLER_OPPFØLGING,
      Roller.DRIFT,
      Roller.PRODUKSJONSSTYRING,
    ];
  }
  const requestHeaders = await headers();
  const token = getAccessTokenOrRedirectToLogin(requestHeaders);

  const JWTVerifyResult = await validerToken(token);

  const grupper = JWTVerifyResult.payload.groups as string[];

  const isDevelopment = isDev();

  // @ts-ignore
  return grupper.map(isDevelopment ? mapRollerFraTokenTilKelvinRollerDev : mapRollerFraTokenTilKelvinRollerProd);
}

// UUID Hentet fra dev.yaml
enum RollerDev {
  BESLUTTER = 'f0f6cad5-e3c0-4308-99a2-3630ac60174a',
  LES = '96e18023-db50-45f7-b023-3251279df28d',
  SAKSBEHANDLER_OPPFØLGING = '33e00155-169b-41e5-8a3f-5582ed975a15',
  KVALITETSSIKRER = 'c3e18aef-a7ac-49df-806e-4fe58b81460d',
  SAKSBEHANDLER_NASJONAL = '3377dc51-ca61-4e36-b812-21b5fc34474f',
  DRIFT = 'bc89623f-4624-4978-ac54-acd048c0f2a5',
  PRODUKSJONSSTYRING = 'c75883f9-4cb2-42c7-b75c-3f0f29ee3ead',
}

function mapRollerFraTokenTilKelvinRollerDev(rolle: string): Roller | undefined {
  switch (rolle) {
    case RollerDev.BESLUTTER:
      return Roller.BESLUTTER;
    case RollerDev.LES:
      return Roller.LES;
    case RollerDev.SAKSBEHANDLER_OPPFØLGING:
      return Roller.SAKSBEHANDLER_OPPFØLGING;
    case RollerDev.KVALITETSSIKRER:
      return Roller.KVALITETSSIKRER;
    case RollerDev.SAKSBEHANDLER_NASJONAL:
      return Roller.SAKSBEHANDLER_NASJONAL;
    case RollerDev.DRIFT:
      return Roller.DRIFT;
    case RollerDev.PRODUKSJONSSTYRING:
      return Roller.PRODUKSJONSSTYRING;
  }
}

// UUID Hentet fra prod.yaml
enum RollerProd {
  BESLUTTER = '5763b52f-f16a-483d-8f40-25be9de95c0a',
  LES = '963df3e5-04f7-415e-8d13-1de981603940',
  SAKSBEHANDLER_OPPFØLGING = '963df3e5-04f7-415e-8d13-1de981603940',
  KVALITETSSIKRER = 'a6bf143f-fee9-41ab-a487-f54503a28de6',
  SAKSBEHANDLER_NASJONAL = '3a65f41a-b3f3-4b1c-830a-df20ff020980',
  DRIFT = 'ff9a228b-4aab-47bd-8aee-598d80f0fb4b',
  PRODUKSJONSSTYRING = '1d61ecf2-fcca-4dbb-ba49-82ab01aef96e',
}

function mapRollerFraTokenTilKelvinRollerProd(rolle: string): Roller | undefined {
  switch (rolle) {
    case RollerProd.BESLUTTER:
      return Roller.BESLUTTER;
    case RollerProd.LES:
      return Roller.LES;
    case RollerProd.SAKSBEHANDLER_OPPFØLGING:
      return Roller.SAKSBEHANDLER_OPPFØLGING;
    case RollerProd.KVALITETSSIKRER:
      return Roller.KVALITETSSIKRER;
    case RollerProd.SAKSBEHANDLER_NASJONAL:
      return Roller.SAKSBEHANDLER_NASJONAL;
    case RollerProd.DRIFT:
      return Roller.DRIFT;
    case RollerProd.PRODUKSJONSSTYRING:
      return Roller.PRODUKSJONSSTYRING;
  }
}
