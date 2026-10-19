export const FLAGS = [
  'RedigerMottakerBrevbygger',
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
  'HoppOverBeslutterVedAvslagSykdom',
  'KanVurdereRefusjonIRevurdering',
  'ForesporselSendtTilBehandlerFrontend',
  'StoppAutomatikkForLegeerklaringVedAvslag',
  'RegistrerMeldedato',
  'SammenhengendeInstitusjonsopphold',
  'PostmottakVelgTema',
] as const;

export type FlagNames = (typeof FLAGS)[number];
export type Flags = Record<FlagNames, boolean>;

export const mockedFlags: Flags = {
  RedigerMottakerBrevbygger: false,
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
  KanVurdereRefusjonIRevurdering: true,
  ForesporselSendtTilBehandlerFrontend: true,
  StoppAutomatikkForLegeerklaringVedAvslag: true,
  RegistrerMeldedato: true,
  SammenhengendeInstitusjonsopphold: true,
  PostmottakVelgTema: false,
};
