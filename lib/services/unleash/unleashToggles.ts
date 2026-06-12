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
  'AvbrytAktivitetspliktbehandling',
  'InfoboksGRegulering',
  'ReturAarsakJournalforing',
  'VisValgForDialogmelding',
  'FjernMarkeringMottatteHelseopplysninger',
  'HentFastlege',
  'StudentV2'
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
  AvbrytAktivitetspliktbehandling: true,
  InfoboksGRegulering: true,
  ReturAarsakJournalforing: true,
  FjernMarkeringMottatteHelseopplysninger: true,
  VisValgForDialogmelding: true,
  StudentV2: true,
  HentFastlege: true,
};
