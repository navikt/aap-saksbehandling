export const FLAGS = [
  'VisArenahistorikkKnapp',
  'ManglendePGIOgEosInntekter',
  'VisAvslagsaarsaker',
  'DigitaliseringAvMeldekortV2Frontend',
  'RevurderStarttidspunkt',
  'VisRettigheterForVedtak',
  'PeriodiseringHelseinstitusjonOpphold',
  'VisIkkeRelevantPeriode',
] as const;

export type FlagNames = (typeof FLAGS)[number];
export type Flags = Record<FlagNames, boolean>;

export const mockedFlags: Flags = {
  VisArenahistorikkKnapp: true,
  ManglendePGIOgEosInntekter: true,
  VisAvslagsaarsaker: true,
  DigitaliseringAvMeldekortV2Frontend: true,
  RevurderStarttidspunkt: true,
  VisRettigheterForVedtak: true,
  PeriodiseringHelseinstitusjonOpphold: true,
  VisIkkeRelevantPeriode: true
};
