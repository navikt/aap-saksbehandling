export const FLAGS = [
  'VisAvslagsaarsaker',
  'VisStansOpphorFrontend',
  'TilbakekrevingBelopFilter',
  'registrereEllerEndreMeldekort',
  'VisArenasakerOversikt',
  'ArenasakerLenkeTilVisninsklient',
  'BegrunnelseForIkkeSendBrev',
  'VisBoksForVurderingOmHastemarkeringSkalFjernes',
  'TilkjentYtelseMedDiff',
  'UnderveisMedDiff',
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
  VisBoksForVurderingOmHastemarkeringSkalFjernes: true,
  TilkjentYtelseMedDiff: true,
  UnderveisMedDiff: true,
  InfoboksGRegulering: true,
  ReturAarsakJournalforing: true,
  Skal1117og1118AlltidVises: true,
  FjernMarkeringMottatteHelseopplysninger: true,
  VisValgForDialogmelding: true,
  StudentV2: true,
  HentFastlege: true,
  OppgavelisteMedBelopISaksbehandling: true,
};
