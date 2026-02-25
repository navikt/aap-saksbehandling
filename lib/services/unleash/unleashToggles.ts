export const FLAGS = [
  'VisArenahistorikkKnapp',
  'ManglendePGIOgEosInntekter',
  'VisAvslagsaarsaker',
  'DigitaliseringAvMeldekortV2Frontend',
  'VisRettigheterForVedtak',
  'PeriodiseringHelseinstitusjonOpphold',
  'VirksomhetsEtablering',
  'studentVurderingPeriodisert',
  'OppgavelisteBackendsorteringFrontend',
] as const;

export type FlagNames = (typeof FLAGS)[number];
export type Flags = Record<FlagNames, boolean>;

export const mockedFlags: Flags = {
  VisArenahistorikkKnapp: true,
  ManglendePGIOgEosInntekter: true,
  VisAvslagsaarsaker: true,
  DigitaliseringAvMeldekortV2Frontend: true,
  VisRettigheterForVedtak: true,
  PeriodiseringHelseinstitusjonOpphold: true,
  VirksomhetsEtablering: true,
  studentVurderingPeriodisert: true,
  OppgavelisteBackendsorteringFrontend: true,
};
