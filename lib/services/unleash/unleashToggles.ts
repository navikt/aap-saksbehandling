export const FLAGS = [
  'BrevUtsendingsinfo',
  'RedigerMottakerBrevbygger',
  'ArenasakerLenkeTilVisninsklient',
  'OppgavelisteMedBelopISaksbehandling',
  'KravSteg',
  'KravManuellVurdering',
  'BeregningstidspunktAarsak',
  'VentStatusForTilbakekreving',
  'VisMigrereSakFraArenaKnapp',
  'Avslag11_27',
  'kopierPerioder',
  'HoppOverBeslutterVedAvslagSykdom',
  'KanVurdereRefusjonIRevurdering',
  'NyFlytEtablerEgenVirksomhet',
  'SammenhengendeInstitusjonsopphold',
  'VisInfoTrekkSoknadForesporselOmLe',
  'PostmottakVelgTema',
  'Helseinstitusjon1Manedsregel',
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
  BeregningstidspunktAarsak: true,
  VentStatusForTilbakekreving: true,
  VisMigrereSakFraArenaKnapp: true,
  Avslag11_27: true,
  kopierPerioder: true,
  HoppOverBeslutterVedAvslagSykdom: true,
  KanVurdereRefusjonIRevurdering: true,
  NyFlytEtablerEgenVirksomhet: true,
  SammenhengendeInstitusjonsopphold: true,
  VisInfoTrekkSoknadForesporselOmLe: true,
  PostmottakVelgTema: false,
  Helseinstitusjon1Manedsregel: true,
};
