export const FLAGS = [
  'BrevUtsendingsinfo',
  'RedigerMottakerBrevbygger',
  'OppgavelisteMedBelopISaksbehandling',
  'KravSteg',
  'KravManuellVurdering',
  'VentStatusForTilbakekreving',
  'VisMigrereSakFraArenaKnapp',
  'Avslag11_27',
  'HoppOverBeslutterVedAvslagSykdom',
  'KanVurdereRefusjonIRevurdering',
  'NyFlytEtablerEgenVirksomhet',
  'SammenhengendeInstitusjonsopphold',
  'VisInfoTrekkSoknadForesporselOmLe',
  'PostmottakVelgTema',
  'Helseinstitusjon1Manedsregel',
  'VisGosysOppgaverForPerson',
] as const;

export type FlagNames = (typeof FLAGS)[number];
export type Flags = Record<FlagNames, boolean>;

export const mockedFlags: Flags = {
  BrevUtsendingsinfo: true,
  RedigerMottakerBrevbygger: true,
  OppgavelisteMedBelopISaksbehandling: true,
  KravSteg: true,
  KravManuellVurdering: true,
  VentStatusForTilbakekreving: true,
  VisMigrereSakFraArenaKnapp: true,
  Avslag11_27: true,
  HoppOverBeslutterVedAvslagSykdom: true,
  KanVurdereRefusjonIRevurdering: true,
  NyFlytEtablerEgenVirksomhet: true,
  SammenhengendeInstitusjonsopphold: true,
  VisInfoTrekkSoknadForesporselOmLe: true,
  PostmottakVelgTema: false,
  Helseinstitusjon1Manedsregel: true,
  VisGosysOppgaverForPerson: true,
};
