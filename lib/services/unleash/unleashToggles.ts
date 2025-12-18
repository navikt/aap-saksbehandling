export const FLAGS = [
  'OvergangArbeidFrontend',
  'PeriodisertSPEFrontend',
  'PeriodisertOvergangUfore',
  'BistandPeriodisert',
  'VisArenahistorikkKnapp',
  'PeriodiserteValgfrieKort',
  'ManglendePGIOgEosInntekter',
  'VisAvslagsaarsaker',
] as const;

export type FlagNames = (typeof FLAGS)[number];
export type Flags = Record<FlagNames, boolean>;

export const mockedFlags: Flags = {
  OvergangArbeidFrontend: true,
  PeriodisertOvergangUfore: true,
  BistandPeriodisert: true,
  PeriodiserteValgfrieKort: true,
  PeriodisertSPEFrontend: true,
  VisArenahistorikkKnapp: true,
  ManglendePGIOgEosInntekter: true,
  VisAvslagsaarsaker: true,
};
