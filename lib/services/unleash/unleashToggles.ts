export const FLAGS = [
  'ArenasakerLenkeTilVisninsklient',
  'OppgavelisteMedBelopISaksbehandling',
  'KravSteg',
  'KravManuellVurdering',
  'BeregningstidspunktAarsak',
  'VentStatusForTilbakekreving',
  'VisMigrereSakFraArenaKnapp',
  'Avslag11_27',
  'DialogMedBehandler',
  'kopierPerioder',
  'autoSplittSykepenger',
  'HoppOverBeslutterVedAvslagSykdom',
  'KanVurdereRefusjonIRevurdering',
  'ForesporselSendtTilBehandlerFrontend',
  'StoppAutomatikkForLegeerklaringVedAvslag',
  'RegistrerMeldedato',
  'SammenhengendeInstitusjonsopphold',
] as const;

export type FlagNames = (typeof FLAGS)[number];
export type Flags = Record<FlagNames, boolean>;

export const mockedFlags: Flags = {
  ArenasakerLenkeTilVisninsklient: true,
  OppgavelisteMedBelopISaksbehandling: true,
  KravSteg: true,
  KravManuellVurdering: true,
  BeregningstidspunktAarsak: true,
  VentStatusForTilbakekreving: true,
  VisMigrereSakFraArenaKnapp: true,
  Avslag11_27: true,
  DialogMedBehandler: true,
  kopierPerioder: true,
  HoppOverBeslutterVedAvslagSykdom: true,
  autoSplittSykepenger: true,
  KanVurdereRefusjonIRevurdering: true,
  ForesporselSendtTilBehandlerFrontend: true,
  StoppAutomatikkForLegeerklaringVedAvslag: true,
  RegistrerMeldedato: true,
  SammenhengendeInstitusjonsopphold: true,
};
