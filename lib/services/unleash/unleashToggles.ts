export const FLAGS = [
  'OvergangArbeidFrontend',
  'PeriodisertSPEFrontend',
  'PeriodisertOvergangUfore',
  'BistandPeriodisert',
  'PeriodisertNedsattArbeidsevneFrontend',
  'VisArenahistorikkKnapp',
  'ManglendePGIOgEosInntekter',
  'VisAvslagsaarsaker',
  'SosialRefusjon',
  'DigitaliseringAvMeldekortV2Frontend',
  'RevurderStarttidspunkt',
  'VisRettigheterForVedtak',
] as const;

export type FlagNames = (typeof FLAGS)[number];
export type Flags = Record<FlagNames, boolean>;

export const mockedFlags: Flags = {
  OvergangArbeidFrontend: true,
  PeriodisertOvergangUfore: true,
  PeriodisertNedsattArbeidsevneFrontend: true,
  BistandPeriodisert: true,
  PeriodisertSPEFrontend: true,
  VisArenahistorikkKnapp: true,
  ManglendePGIOgEosInntekter: true,
  VisAvslagsaarsaker: true,
  SosialRefusjon: true,
  DigitaliseringAvMeldekortV2Frontend: true,
  RevurderStarttidspunkt: true,
  VisRettigheterForVedtak: true,
};
