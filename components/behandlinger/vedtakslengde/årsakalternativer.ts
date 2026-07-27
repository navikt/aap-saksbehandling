import { VedtakslengdeÅrsak } from 'lib/types/types';

import { ValuePair } from 'components/form/FormField';

export const årsakAlternativer: ValuePair<VedtakslengdeÅrsak | undefined>[] = [
  {
    value: 'MAKS_ETT_ÅR',
    label: '§ 6 i AAP-forskriften, vedtak maks 1 år',
  },
  {
    value: 'BRUKER_OVER_67',
    label: '§ 11-4 Bruker blir 67 år',
  },
  {
    value: 'IKKE_MEDLEM',
    label: 'Oppfyller ikke krav til medlemskap',
  },
  {
    value: 'ORDINÆRKVOTE_BRUKT_OPP',
    label: '§ 11-12 Ordinær kvote brukt opp',
  },
  {
    value: 'BRUDD_PÅ_OPPHOLDSKRAV_STANS',
    label: '§ 11-3 Utenlandsopphold',
  },
  { value: 'IKKE_RETT_UNDER_STRAFFEGJENNOMFØRING', label: '§ 11-26 Soning' },
  { value: 'ANNEN_FULL_YTELSE', label: '§ 11-27: Annen full ytelse' },
];
