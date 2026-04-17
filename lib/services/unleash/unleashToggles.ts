export const FLAGS = [
  'VisAvslagsaarsaker',
  'DigitaliseringAvMeldekortV2Frontend',
  'VisStansOpphorFrontend',
  'SamordningBarnepensjon',
  'VedtakslengdeAvklaringsbehov',
  'VisSisteDagMedRett',
  'Redigitalisering',
  'InkluderOvergangUforeArbeid',
] as const;

export type FlagNames = (typeof FLAGS)[number];
export type Flags = Record<FlagNames, boolean>;

export const mockedFlags: Flags = {
  VisAvslagsaarsaker: true,
  DigitaliseringAvMeldekortV2Frontend: true,
  VisStansOpphorFrontend: true,
  SamordningBarnepensjon: true,
  VedtakslengdeAvklaringsbehov: true,
  VisSisteDagMedRett: true,
  Redigitalisering: true,
  InkluderOvergangUforeArbeid: true,
};
