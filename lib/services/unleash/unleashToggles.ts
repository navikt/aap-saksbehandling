export const FLAGS = [
  'VisAvslagsaarsaker',
  'VisStansOpphorFrontend',
  'InkluderOvergangUforeArbeid',
  'TilbakekrevingBelopFilter',
  'registrereEllerEndreMeldekort',
  'VisArenasakerOversikt',
  'ArenasakerLenkeTilVisninsklient',
  'BegrunnelseForIkkeSendBrev',
  'ForutgaaendeGap',
  'TilkjentYtelseMedDiff',
  'AvbrytAktivitetspliktbehandling',
  'Hjelpetekster115Frontend',
  'InfoboksGRegulering',
  'ReturAarsakJournalforing',
] as const;

export type FlagNames = (typeof FLAGS)[number];
export type Flags = Record<FlagNames, boolean>;

export const mockedFlags: Flags = {
  VisAvslagsaarsaker: true,
  VisStansOpphorFrontend: true,
  InkluderOvergangUforeArbeid: true,
  TilbakekrevingBelopFilter: true,
  registrereEllerEndreMeldekort: true,
  VisArenasakerOversikt: true,
  ArenasakerLenkeTilVisninsklient: true,
  BegrunnelseForIkkeSendBrev: true,
  ForutgaaendeGap: true,
  TilkjentYtelseMedDiff: true,
  AvbrytAktivitetspliktbehandling: true,
  Hjelpetekster115Frontend: true,
  InfoboksGRegulering: true,
  ReturAarsakJournalforing: true,
};
