export const FLAGS = [
  'VisAvslagsaarsaker',
  'VisStansOpphorFrontend',
  'TilbakekrevingBelopFilter',
  'registrereEllerEndreMeldekort',
  'VisArenasakerOversikt',
  'ArenasakerLenkeTilVisninsklient',
  'BegrunnelseForIkkeSendBrev',
  'TilkjentYtelseMedDiff',
  'UnderveisMedDiff',
  'AvbrytAktivitetspliktbehandling',
  'InfoboksGRegulering',
  'ReturAarsakJournalforing',
  'Skal1117og1118AlltidVises',
  'VisValgForDialogmelding',
  'FjernMarkeringMottatteHelseopplysninger',
  'HentFastlege',
  'StudentV2',
  'OppgavelisteMedBelopISaksbehandling',
] as const;

export type FlagNames = (typeof FLAGS)[number];
export type Flags = Record<FlagNames, boolean>;

export const mockedFlags: Flags = {
  VisAvslagsaarsaker: true,
  VisStansOpphorFrontend: true,
  TilbakekrevingBelopFilter: true,
  registrereEllerEndreMeldekort: true,
  VisArenasakerOversikt: true,
  ArenasakerLenkeTilVisninsklient: true,
  BegrunnelseForIkkeSendBrev: true,
  TilkjentYtelseMedDiff: true,
  UnderveisMedDiff: true,
  AvbrytAktivitetspliktbehandling: true,
  InfoboksGRegulering: true,
  ReturAarsakJournalforing: true,
  Skal1117og1118AlltidVises: true,
  FjernMarkeringMottatteHelseopplysninger: true,
  VisValgForDialogmelding: true,
  StudentV2: true,
  HentFastlege: true,
  OppgavelisteMedBelopISaksbehandling: true,
};
