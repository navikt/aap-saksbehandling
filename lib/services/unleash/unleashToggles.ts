export const FLAGS = [
  'VisAvslagsaarsaker',
  'DigitaliseringAvMeldekortV2Frontend',
  'VisRettigheterForVedtak',
  'VirksomhetsEtablering',
  'NyTidligereVurderinger',
  'OppgavelisteBackendsorteringFrontend',
  'VisStansOpphorFrontend',
  'SamordningBarnepensjon',
  'VedtakslengdeAvklaringsbehov',
] as const;

export type FlagNames = (typeof FLAGS)[number];
export type Flags = Record<FlagNames, boolean>;

export const mockedFlags: Flags = {
  VisAvslagsaarsaker: true,
  DigitaliseringAvMeldekortV2Frontend: true,
  VisRettigheterForVedtak: true,
  VirksomhetsEtablering: true,
  NyTidligereVurderinger: true,
  OppgavelisteBackendsorteringFrontend: true,
  VisStansOpphorFrontend: true,
  SamordningBarnepensjon: true,
  VedtakslengdeAvklaringsbehov: true,
};
