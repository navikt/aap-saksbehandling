import { VedtakslengdeÅrsak } from 'lib/types/types';

import { ValuePair } from 'components/form/FormField';

export const årsakOversettelse: Record<VedtakslengdeÅrsak, string> = {
  AUTOMATISK: 'Automatisk',
  MAKS_ETT_ÅR: '§ 6 i AAP-forskriften, vedtak maks 1 år',
  BRUKER_OVER_67: '§ 11-4 Bruker blir 67 år',
  IKKE_MEDLEM: 'Oppfyller ikke krav til medlemskap',
  ORDINÆRKVOTE_BRUKT_OPP: '§ 11-12 Ordinær kvote brukt opp',
  BRUDD_PÅ_OPPHOLDSKRAV_STANS: '§ 11-3 Utenlandsopphold',
  IKKE_RETT_UNDER_STRAFFEGJENNOMFØRING: '§ 11-26 Soning',
  ANNEN_FULL_YTELSE: '§ 11-27: Annen full ytelse',
};

const godkjenteAlternativer: VedtakslengdeÅrsak[] = [
  'MAKS_ETT_ÅR',
  'BRUKER_OVER_67',
  'IKKE_MEDLEM',
  'ORDINÆRKVOTE_BRUKT_OPP',
  'BRUDD_PÅ_OPPHOLDSKRAV_STANS',
  'IKKE_RETT_UNDER_STRAFFEGJENNOMFØRING',
  'ANNEN_FULL_YTELSE',
];

export const årsakAlternativer: ValuePair<VedtakslengdeÅrsak | undefined>[] = godkjenteAlternativer.map((årsak) => ({
  value: årsak,
  label: årsakOversettelse[årsak],
}));
