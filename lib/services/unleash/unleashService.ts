import 'server-only';
import { Unleash } from 'unleash-client';
import { isLocal } from 'lib/utils/environment';
import { FlagNames, FLAGS, Flags, mockedFlags } from 'lib/services/unleash/unleashToggles';

export interface IUnleash {
  isEnabled(flagName: FlagNames): boolean;
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

// Bruk mock-unleash hvis LOKALT og env-variabel ikke er satt, for DEV og PROD bruker den alltid ekte unleash
export const unleashService =
  process.env.UNLEASH_SERVER_API_URL == null && isLocal() ? createMockUnleash() : createRealUnleash();

export function getAllFlags(): Flags {
  return Object.fromEntries(FLAGS.map((name) => [name, unleashService.isEnabled(name)])) as Flags;
}
