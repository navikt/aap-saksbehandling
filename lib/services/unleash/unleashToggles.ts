export const FLAGS = [
  'VisAvslagsaarsaker',
  'DigitaliseringAvMeldekortV2Frontend',
  'VisRettigheterForVedtak',
  'VirksomhetsEtablering',
  'VisStansOpphorFrontend',
  'SamordningBarnepensjon',
  'NySaksBehandlingOversikt',
  'VedtakslengdeAvklaringsbehov',
  'BekreftVurderingerOppfolging',
  'automatiskMellomlagring',
] as const;

export type FlagNames = (typeof FLAGS)[number];
export type Flags = Record<FlagNames, boolean>;

export const mockedFlags: Flags = {
  VisAvslagsaarsaker: true,
  DigitaliseringAvMeldekortV2Frontend: true,
  VisRettigheterForVedtak: true,
  VirksomhetsEtablering: true,
  VisStansOpphorFrontend: true,
  SamordningBarnepensjon: true,
  NySaksBehandlingOversikt: true,
  VedtakslengdeAvklaringsbehov: true,
  automatiskMellomlagring: true,
  BekreftVurderingerOppfolging: true,
};
