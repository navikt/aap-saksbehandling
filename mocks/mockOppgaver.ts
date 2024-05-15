import { addDays, endOfDay, subDays, subWeeks } from 'date-fns';

import { Avklaringsbehovtype, Oppgave, Oppgaver } from 'lib/types/oppgavebehandling';

export const mockOppgaver: Oppgaver = {
  oppgaver: [
    {
      oppgaveId: 1234,
      avklaringsbehov: Avklaringsbehovtype.AVKLAR_SYKDOM,
      status: 'OPPRETTET',
      foedselsnummer: '09837600004',
      avklaringsbehovOpprettetTid: subDays(new Date(), 67).toISOString(),
      behandlingOpprettetTid: subDays(new Date(), 67).toISOString(),
      reservertTil: endOfDay(addDays(new Date(), 3)).toISOString(),
      versjon: 1,
      tilordnetRessurs: 'Flagrende Gevant',
    },
    {
      oppgaveId: 8935,
      avklaringsbehov: Avklaringsbehovtype.AVKLAR_SYKDOM,
      status: 'OPPRETTET',
      foedselsnummer: '17837900007',
      avklaringsbehovOpprettetTid: subWeeks(new Date(), 4).toISOString(),
      behandlingOpprettetTid: subWeeks(new Date(), 4).toISOString(),
      reservertTil: endOfDay(addDays(new Date(), 3)).toISOString(),
      versjon: 1,
      tilordnetRessurs: 'Eklektisk Kappe',
    },
    {
      oppgaveId: 3840,
      avklaringsbehov: Avklaringsbehovtype.AVKLAR_SYKDOM,
      status: 'OPPRETTET',
      foedselsnummer: '14839400004',
      avklaringsbehovOpprettetTid: subDays(new Date(), 9).toISOString(),
      behandlingOpprettetTid: subDays(new Date(), 9).toISOString(),
      reservertTil: endOfDay(addDays(new Date(), 3)).toISOString(),
      versjon: 1,
      tilordnetRessurs: 'Ambulerende Bie',
    },
  ],
};

export const ufordeltOppgave: Oppgave[] = [
  {
    oppgaveId: 3045,
    avklaringsbehov: Avklaringsbehovtype.AVKLAR_SYKDOM,
    status: 'OPPRETTET',
    foedselsnummer: '09837600004',
    avklaringsbehovOpprettetTid: subWeeks(new Date(), 4).toISOString(),
    behandlingOpprettetTid: subWeeks(new Date(), 4).toISOString(),
    reservertTil: endOfDay(addDays(new Date(), 3)).toISOString(),
    versjon: 1,
    tilordnetRessurs: undefined,
  },
];

export const fordeltOppgave: Oppgave[] = [
  {
    oppgaveId: 2856,
    avklaringsbehov: Avklaringsbehovtype.AVKLAR_SYKDOM,
    status: 'OPPRETTET',
    foedselsnummer: '09837600004',
    avklaringsbehovOpprettetTid: subWeeks(new Date(), 4).toISOString(),
    behandlingOpprettetTid: subWeeks(new Date(), 4).toISOString(),
    reservertTil: endOfDay(addDays(new Date(), 3)).toISOString(),
    versjon: 1,
    tilordnetRessurs: 'Eklektisk Kappe',
  },
];
