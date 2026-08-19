import 'server-only';
import { Unleash } from 'unleash-client';
import { FlagNames, FLAGS, Flags, mockedFlags } from 'lib/services/unleash/unleashToggles';
import type { Context } from 'unleash-client/lib/context';

export interface IUnleash {
  isEnabled(flagName: FlagNames, context?: Context): boolean;
}

function createRealUnleash(): IUnleash {
  return new Unleash({
    url: `${process.env.UNLEASH_SERVER_API_URL}/api`,
    environment: process.env.UNLEASH_SERVER_API_ENV!,
    appName: 'aap-saksbehandling',
    customHeaders: {
      Authorization: process.env.UNLEASH_SERVER_API_TOKEN!,
    },
  });
}

function createMockUnleash(): IUnleash {
  return {
    isEnabled: (flagName: FlagNames) => mockedFlags[flagName],
  };
}

// Bruk mock-unleash hvis UNLEASH_SERVER_API_URL ikke er satt (f.eks. lokalt eller under build),
// ellers (DEV/PROD med env-variabel satt) bruker den ekte unleash
export const unleashService = process.env.UNLEASH_SERVER_API_URL == null ? createMockUnleash() : createRealUnleash();

export function getAllFlags(userId: string | undefined): Flags {
  return Object.fromEntries(FLAGS.map((name) => [name, unleashService.isEnabled(name, { userId })])) as Flags;
}
