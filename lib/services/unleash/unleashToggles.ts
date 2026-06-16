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
  'VisBoksForVurderingOmHastemarkeringSkalFjernes',
  'AvbrytAktivitetspliktbehandling',
  'InfoboksGRegulering',
  'ReturAarsakJournalforing',
  'Skal1117og1118AlltidVises',
  'VisValgForDialogmelding',
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
  VisBoksForVurderingOmHastemarkeringSkalFjernes: true,
  AvbrytAktivitetspliktbehandling: true,
  InfoboksGRegulering: true,
  ReturAarsakJournalforing: true,
  Skal1117og1118AlltidVises: true,
  VisValgForDialogmelding: true,
};
