export const FLAGS = [
  'VisAvslagsaarsaker',
  'VisStansOpphorFrontend',
  'InkluderOvergangUforeArbeid',
  'TilbakekrevingBelopFilter',
  'registrereEllerEndreMeldekort',
  'SykdomUtenVissVarighetFrontend',
  'VisArenasakerOversikt',
  'ArenasakerLenkeTilVisninsklient',
  'BegrunnelseForIkkeSendBrev',
  'ForutgaaendeGap',
  'TilkjentYtelseMedDiff',
  'AvbrytAktivitetspliktbehandling',
  'Hjelpetekster115Frontend',
  'InfoboksGRegulering',
] as const;

export type FlagNames = (typeof FLAGS)[number];
export type Flags = Record<FlagNames, boolean>;

export const mockedFlags: Flags = {
  VisAvslagsaarsaker: true,
  VisStansOpphorFrontend: true,
  InkluderOvergangUforeArbeid: true,
  TilbakekrevingBelopFilter: true,
  registrereEllerEndreMeldekort: true,
  SykdomUtenVissVarighetFrontend: true,
  VisArenasakerOversikt: true,
  ArenasakerLenkeTilVisninsklient: true,
  BegrunnelseForIkkeSendBrev: true,
  ForutgaaendeGap: true,
  TilkjentYtelseMedDiff: true,
  AvbrytAktivitetspliktbehandling: true,
  Hjelpetekster115Frontend: true,
  InfoboksGRegulering: true,
};
