export const FLAGS = [
  'OvergangArbeidFrontend',
  'PeriodisertSPEFrontend',
  'PeriodisertOvergangUfore',
  'BistandPeriodisert',
  'PeriodisertNedsattArbeidsevneFrontend',
  'VisArenahistorikkKnapp',
  'ManglendePGIOgEosInntekter',
  'VisAvslagsaarsaker',
  'DigitaliseringAvMeldekortV2Frontend',
  'Sykestipend',
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
  DigitaliseringAvMeldekortV2Frontend: true,
  Sykestipend: true,
  RevurderStarttidspunkt: true,
  VisRettigheterForVedtak: true,
};
