export const FLAGS = [
  'VisAvslagsaarsaker',
  'VisStansOpphorFrontend',
  'registrereEllerEndreMeldekort',
  'VisArenasakerOversikt',
  'ArenasakerLenkeTilVisninsklient',
  'BegrunnelseForIkkeSendBrev',
  'ReturAarsakJournalforing',
  'VisValgForDialogmelding',
  'HentFastlege',
  'StudentV2',
  'OppgavelisteMedBelopISaksbehandling',
  'KravSteg',
] as const;

export type FlagNames = (typeof FLAGS)[number];
export type Flags = Record<FlagNames, boolean>;

export const mockedFlags: Flags = {
  VisAvslagsaarsaker: true,
  VisStansOpphorFrontend: true,
  registrereEllerEndreMeldekort: true,
  VisArenasakerOversikt: true,
  ArenasakerLenkeTilVisninsklient: true,
  BegrunnelseForIkkeSendBrev: true,
  ReturAarsakJournalforing: true,
  VisValgForDialogmelding: true,
  StudentV2: true,
  HentFastlege: true,
  OppgavelisteMedBelopISaksbehandling: true,
  KravSteg: true,
};
