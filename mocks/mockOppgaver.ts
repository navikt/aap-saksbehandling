import { addDays, endOfDay, subDays, subWeeks } from 'date-fns';

import { Oppgave, Oppgaver } from 'lib/types/oppgavebehandling';

export const mockOppgaver: Oppgaver = {
  oppgaver: [
    {
      navn: '09837600004',
      søknadstype: 'Førstegangssøknad',
      type: '11-14 Student',
      opprettet: subDays(new Date(), 67).toISOString(),
      saksbehandler: undefined,
      reservertTil: endOfDay(addDays(new Date(), 3)).toISOString(),
      oppgaveId: 34580234,
      foedselsnummer: '12345678910',
      oppgavetype: 'AAP',
      versjon: 1,
      tilordnetRessurs: 'Flagrende Gevant',
    },
    {
      navn: '17837900007',
      søknadstype: 'Førstegangssøknad',
      type: '11-4 Alder',
      opprettet: subWeeks(new Date(), 4).toISOString(),
      reservertTil: endOfDay(addDays(new Date(), 3)).toISOString(),
      oppgaveId: 82012447,
      foedselsnummer: '12345678910',
      oppgavetype: 'AAP',
      versjon: 1,
      tilordnetRessurs: 'Eklektisk Kappe',
    },
    {
      navn: '14839400004',
      søknadstype: 'Førstegangssøknad',
      type: '11-22 Yrkesskade',
      opprettet: subDays(new Date(), 9).toISOString(),
      saksbehandler: 'Eklektisk Kappe',
      reservertTil: endOfDay(addDays(new Date(), 3)).toISOString(),
      oppgaveId: 60219384,
      foedselsnummer: '12345678910',
      oppgavetype: 'AAP',
      versjon: 1,
      tilordnetRessurs: 'Ambulerende Bie',
    },
  ],
};

export const ufordeltOppgave: Oppgave[] = [
  {
    navn: '09837600004',
    søknadstype: 'Førstegangssøknad',
    type: '11-4 Alder',
    opprettet: subWeeks(new Date(), 4).toISOString(),
    reservertTil: endOfDay(addDays(new Date(), 3)).toISOString(),
    oppgaveId: 34580234,
    foedselsnummer: '12345678910',
    oppgavetype: 'AAP',
    versjon: 1,
    tilordnetRessurs: undefined,
  },
];

export const fordeltOppgave: Oppgave[] = [
  {
    navn: '09837600004',
    søknadstype: 'Førstegangssøknad',
    type: '11-4 Alder',
    opprettet: subWeeks(new Date(), 4).toISOString(),
    reservertTil: endOfDay(addDays(new Date(), 3)).toISOString(),
    oppgaveId: 34580234,
    foedselsnummer: '12345678910',
    oppgavetype: 'AAP',
    versjon: 1,
    tilordnetRessurs: 'Eklektisk Kappe',
  },
];
