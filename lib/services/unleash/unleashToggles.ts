export const FLAGS = [
  'VisAvslagsaarsaker',
  'DigitaliseringAvMeldekortV2Frontend',
  'VisRettigheterForVedtak',
  'VirksomhetsEtablering',
  'VisStansOpphorFrontend',
  'SamordningBarnepensjon',
  'VedtakslengdeAvklaringsbehov',
  'BekreftVurderingerOppfolging',
  'automatiskMellomlagring',
  'hentUforesoknadsdata',
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
  VedtakslengdeAvklaringsbehov: true,
  automatiskMellomlagring: true,
  BekreftVurderingerOppfolging: true,
  hentUforesoknadsdata: true,
};
