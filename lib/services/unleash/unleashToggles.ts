export const FLAGS = [
  'BrevUtsendingsinfo',
  'RedigerMottakerBrevbygger',
  'ArenasakerLenkeTilVisninsklient',
  'OppgavelisteMedBelopISaksbehandling',
  'KravSteg',
  'KravManuellVurdering',
  'VentStatusForTilbakekreving',
  'VisMigrereSakFraArenaKnapp',
  'Avslag11_27',
  'HoppOverBeslutterVedAvslagSykdom',
  'KanVurdereRefusjonIRevurdering',
  'NyFlytEtablerEgenVirksomhet',
  'VisInfoTrekkSoknadForesporselOmLe',
  'PostmottakVelgTema',
  'VisGosysOppgaverForPerson',
  'VedtaksperiodeBeslutter',
] as const;

export type FlagNames = (typeof FLAGS)[number];
export type Flags = Record<FlagNames, boolean>;

export const mockedFlags: Flags = {
  BrevUtsendingsinfo: true,
  RedigerMottakerBrevbygger: true,
  ArenasakerLenkeTilVisninsklient: true,
  OppgavelisteMedBelopISaksbehandling: true,
  KravSteg: true,
  KravManuellVurdering: true,
  VentStatusForTilbakekreving: true,
  VisMigrereSakFraArenaKnapp: true,
  Avslag11_27: true,
  HoppOverBeslutterVedAvslagSykdom: true,
  KanVurdereRefusjonIRevurdering: true,
  NyFlytEtablerEgenVirksomhet: true,
  VisInfoTrekkSoknadForesporselOmLe: true,
  PostmottakVelgTema: false,
  VisGosysOppgaverForPerson: true,
  VedtaksperiodeBeslutter: true,
};
