import { addDays, endOfDay, subDays, subWeeks } from 'date-fns';

import { Oppgaver } from 'lib/types/oppgavebehandling';

export const mockOppgaver: Oppgaver = {
  oppgaver: [
    {
      navn: '09837600004',
      søknadstype: 'Førstegangssøknad',
      type: '11-14 Student',
      opprettet: subDays(new Date(), 67).toISOString(),
      saksbehandler: undefined,
      reservertTil: endOfDay(addDays(new Date(), 3)).toISOString(),
    },
    {
      navn: '17837900007',
      søknadstype: 'Førstegangssøknad',
      type: '11-4 Alder',
      opprettet: subWeeks(new Date(), 4).toISOString(),
      saksbehandler: undefined,
      reservertTil: endOfDay(addDays(new Date(), 3)).toISOString(),
    },
    {
      navn: '14839400004',
      søknadstype: 'Førstegangssøknad',
      type: '11-22 Yrkesskade',
      opprettet: subDays(new Date(), 9).toISOString(),
      saksbehandler: 'Eklektisk Kappe',
      reservertTil: endOfDay(addDays(new Date(), 3)).toISOString(),
    },
  ],
};

export const ufordeltOppgave = [
  {
    navn: '09837600004',
    søknadstype: 'Førstegangssøknad',
    type: '11-4 Alder',
    opprettet: subWeeks(new Date(), 4).toISOString(),
    saksbehandler: undefined,
    reservertTil: endOfDay(addDays(new Date(), 3)).toISOString(),
  },
];

export const fordeltOppgave = [
  {
    navn: '09837600004',
    søknadstype: 'Førstegangssøknad',
    type: '11-4 Alder',
    opprettet: subWeeks(new Date(), 4).toISOString(),
    saksbehandler: 'Eklektisk Kappe',
    reservertTil: endOfDay(addDays(new Date(), 3)).toISOString(),
  },
];
