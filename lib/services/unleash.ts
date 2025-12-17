import { Unleash } from 'unleash-client';
import { isLocal } from 'lib/utils/environment';

const FLAGS = ['OvergangArbeidFrontend', 'PeriodisertSPEFrontend'] as const;

export type FlagNames = (typeof FLAGS)[number];
export type Flags = Record<FlagNames, boolean>;

interface IUnleash {
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

export const mockedFlags: Flags = {
  OvergangArbeidFrontend: true,
  PeriodisertSPEFrontend: true,
};

function createMockUnleash(): IUnleash {
  return {
    isEnabled: (flagName: FlagNames) => mockedFlags[flagName],
  };
}

// Bruk mock-unleash hvis LOKALT og env-variabel ikke er satt, for DEV og PROD bruker den alltid ekte unleash
export const unleash =
  process.env.UNLEASH_SERVER_API_URL == null && isLocal() ? createMockUnleash() : createRealUnleash();

export function getAllFlags(): Flags {
  return Object.fromEntries(FLAGS.map((name) => [name, unleash.isEnabled(name)])) as Flags;
}
