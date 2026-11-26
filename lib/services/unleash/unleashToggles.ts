export const FLAGS = [
  'BrevUtsendingsinfo',
  'RedigerMottakerBrevbygger',
  'ArenasakerLenkeTilVisninsklient',
  'KravSteg',
  'KravManuellVurdering',
  'VentStatusForTilbakekreving',
  'VisMigrereSakFraArenaKnapp',
  'Avslag11_27',
  'KanVurdereRefusjonIRevurdering',
  'NyFlytEtablerEgenVirksomhet',
  'VisInfoTrekkSoknadForesporselOmLe',
  'PostmottakVelgTema',
  'KnappForManuellPaaminnelse',
  'MaksdatoSykepenger',
  'SeOriginalDokumentVariant',
  'VedtaksperiodeBeslutter',
  'UtenlandsoppholdBehandling',
] as const;

export type FlagNames = (typeof FLAGS)[number];
export type Flags = Record<FlagNames, boolean>;

export const mockedFlags: Flags = {
  BrevUtsendingsinfo: true,
  RedigerMottakerBrevbygger: true,
  ArenasakerLenkeTilVisninsklient: true,
  KravSteg: true,
  KravManuellVurdering: true,
  VentStatusForTilbakekreving: true,
  VisMigrereSakFraArenaKnapp: true,
  Avslag11_27: true,
  KanVurdereRefusjonIRevurdering: true,
  NyFlytEtablerEgenVirksomhet: true,
  VisInfoTrekkSoknadForesporselOmLe: true,
  PostmottakVelgTema: false,
  KnappForManuellPaaminnelse: true,
  MaksdatoSykepenger: true,
  SeOriginalDokumentVariant: true,
  VedtaksperiodeBeslutter: true,
  UtenlandsoppholdBehandling: true,
};
