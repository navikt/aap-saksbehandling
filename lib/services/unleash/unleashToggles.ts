export const FLAGS = [
  'OvergangArbeidFrontend',
  'PeriodisertSPEFrontend',
  'PeriodisertOvergangUfore',
  'BistandPeriodisert',
  'PeriodisertNedsattArbeidsevneFrontend',
  'VisArenahistorikkKnapp',
  'PeriodiserteValgfrieKort',
  'ManglendePGIOgEosInntekter',
  'VisAvslagsaarsaker',
  'SosialRefusjon',
  'DigitaliseringAvMeldekortV2Frontend',
  'Sykestipend',
] as const;

export type FlagNames = (typeof FLAGS)[number];
export type Flags = Record<FlagNames, boolean>;

export const mockedFlags: Flags = {
  OvergangArbeidFrontend: true,
  PeriodisertOvergangUfore: true,
  PeriodisertNedsattArbeidsevneFrontend: true,
  BistandPeriodisert: true,
  PeriodiserteValgfrieKort: true,
  PeriodisertSPEFrontend: true,
  VisArenahistorikkKnapp: true,
  ManglendePGIOgEosInntekter: true,
  VisAvslagsaarsaker: true,
  SosialRefusjon: true,
  DigitaliseringAvMeldekortV2Frontend: true,
  Sykestipend: true,
};
