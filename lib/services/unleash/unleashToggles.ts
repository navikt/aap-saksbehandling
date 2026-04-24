export const FLAGS = [
  'VisAvslagsaarsaker',
  'DigitaliseringAvMeldekortV2Frontend',
  'VisStansOpphorFrontend',
  'VisSisteDagMedRett',
  'Redigitalisering',
  'InkluderOvergangUforeArbeid',
  'TilbakekrevingBelopFilter',
  'registrereEllerEndreMeldekort',
] as const;

export type FlagNames = (typeof FLAGS)[number];
export type Flags = Record<FlagNames, boolean>;

export const mockedFlags: Flags = {
  VisAvslagsaarsaker: true,
  DigitaliseringAvMeldekortV2Frontend: true,
  VisStansOpphorFrontend: true,
  VisSisteDagMedRett: true,
  Redigitalisering: true,
  InkluderOvergangUforeArbeid: true,
  TilbakekrevingBelopFilter: true,
  registrereEllerEndreMeldekort: true,
};
