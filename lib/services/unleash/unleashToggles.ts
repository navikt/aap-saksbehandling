export const FLAGS = [
  'VisAvslagsaarsaker',
  'DigitaliseringAvMeldekortV2Frontend',
  'VisStansOpphorFrontend',
  'SamordningBarnepensjon',
  'VedtakslengdeAvklaringsbehov',
  'BekreftVurderingerOppfolging',
  'SjekkTildelingVedBekreft',
  'DodsdatoBarn',
  'VisSisteDagMedRett',
] as const;

export type FlagNames = (typeof FLAGS)[number];
export type Flags = Record<FlagNames, boolean>;

export const mockedFlags: Flags = {
  VisAvslagsaarsaker: true,
  DigitaliseringAvMeldekortV2Frontend: true,
  VisStansOpphorFrontend: true,
  SamordningBarnepensjon: true,
  VedtakslengdeAvklaringsbehov: true,
  BekreftVurderingerOppfolging: true,
  SjekkTildelingVedBekreft: true,
  DodsdatoBarn: true,
  VisSisteDagMedRett: true,
};
