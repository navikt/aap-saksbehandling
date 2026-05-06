export const FLAGS = [
  'VisAvslagsaarsaker',
  'VisStansOpphorFrontend',
  'Redigitalisering',
  'InkluderOvergangUforeArbeid',
  'TilbakekrevingBelopFilter',
  'registrereEllerEndreMeldekort',
  'ForeslaaVedtakVedtakslengde',
  'SykdomUtenVissVarighetFrontend',
  'VisArenasakerOversikt',
  'ArenasakerLenkeTilVisninsklient',
  'BegrunnelseForIkkeSendBrev',
] as const;

export type FlagNames = (typeof FLAGS)[number];
export type Flags = Record<FlagNames, boolean>;

export const mockedFlags: Flags = {
  VisAvslagsaarsaker: true,
  VisStansOpphorFrontend: true,
  Redigitalisering: true,
  InkluderOvergangUforeArbeid: true,
  TilbakekrevingBelopFilter: true,
  registrereEllerEndreMeldekort: true,
  SykdomUtenVissVarighetFrontend: true,
  ForeslaaVedtakVedtakslengde: true,
  VisArenasakerOversikt: true,
  ArenasakerLenkeTilVisninsklient: true,
  BegrunnelseForIkkeSendBrev: true,
};
