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
  'UnderveisMedDiff',
  'AvbrytAktivitetspliktbehandling',
  'RedigitaliseringV2',
  'Hjelpetekster115Frontend',
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
  UnderveisMedDiff: true,
  AvbrytAktivitetspliktbehandling: true,
  RedigitaliseringV2: true,
  Hjelpetekster115Frontend: true,
};
