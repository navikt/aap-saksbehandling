export const FLAGS = [
  'VisArenahistorikkKnapp',
  'VisAvslagsaarsaker',
  'DigitaliseringAvMeldekortV2Frontend',
  'VisRettigheterForVedtak',
  'VirksomhetsEtablering',
  'studentVurderingPeriodisert',
  'NyTidligereVurderinger',
  'OppgavelisteBackendsorteringFrontend',
  'LenkeMetabase',
  'VisStansOpphorFrontend',
] as const;

export type FlagNames = (typeof FLAGS)[number];
export type Flags = Record<FlagNames, boolean>;

export const mockedFlags: Flags = {
  VisArenahistorikkKnapp: true,
  VisAvslagsaarsaker: true,
  DigitaliseringAvMeldekortV2Frontend: true,
  VisRettigheterForVedtak: true,
  VirksomhetsEtablering: true,
  studentVurderingPeriodisert: true,
  NyTidligereVurderinger: true,
  OppgavelisteBackendsorteringFrontend: true,
  LenkeMetabase: true,
  VisStansOpphorFrontend: true,
};
