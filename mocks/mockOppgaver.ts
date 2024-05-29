import { addDays, endOfDay, subDays, subWeeks } from 'date-fns';

import { Oppgave, Oppgaver } from 'lib/types/oppgavebehandling';

export const mockOppgaver: Oppgaver = {
  oppgaver: [
    {
      oppgaveId: 1234,
      saksnummer: '3457345',
      behandlingstype: 'Førstegangsbehandling',
      behandlingsreferanse: '346345727',
      avklaringsbehov: 'AVKLAR_SYKDOM',
      status: 'OPPRETTET',
      foedselsnummer: '09837600004',
      avklaringsbehovOpprettetTid: subDays(new Date(), 67).toISOString(),
      behandlingOpprettetTid: subDays(new Date(), 67).toISOString(),
      oppgaveOpprettet: subDays(new Date(), 67).toISOString(),
      reservertTil: endOfDay(addDays(new Date(), 3)).toISOString(),
    },
    {
      oppgaveId: 8935,
      saksnummer: '34563',
      behandlingstype: 'Førstegangsbehandling',
      behandlingsreferanse: '7345234',
      avklaringsbehov: 'AVKLAR_SYKDOM',
      status: 'OPPRETTET',
      foedselsnummer: '17837900007',
      avklaringsbehovOpprettetTid: subWeeks(new Date(), 4).toISOString(),
      behandlingOpprettetTid: subWeeks(new Date(), 4).toISOString(),
      oppgaveOpprettet: subWeeks(new Date(), 4).toISOString(),
      reservertTil: endOfDay(addDays(new Date(), 3)).toISOString(),
    },
    {
      oppgaveId: 3840,
      saksnummer: '1284534',
      behandlingstype: 'Førstegangsbehandling',
      behandlingsreferanse: '6345723567',
      avklaringsbehov: 'AVKLAR_SYKDOM',
      status: 'OPPRETTET',
      foedselsnummer: '14839400004',
      avklaringsbehovOpprettetTid: subDays(new Date(), 9).toISOString(),
      behandlingOpprettetTid: subDays(new Date(), 9).toISOString(),
      oppgaveOpprettet: subDays(new Date(), 9).toISOString(),
      reservertTil: endOfDay(addDays(new Date(), 3)).toISOString(),
    },
  ],
};

export const ufordeltOppgave: Oppgave[] = [
  {
    oppgaveId: 3045,
    saksnummer: '3456',
    behandlingstype: 'Førstegangsbehandling',
    behandlingsreferanse: '234264356',
    avklaringsbehov: 'AVKLAR_SYKDOM',
    status: 'OPPRETTET',
    foedselsnummer: '09837600004',
    avklaringsbehovOpprettetTid: subWeeks(new Date(), 4).toISOString(),
    behandlingOpprettetTid: subWeeks(new Date(), 4).toISOString(),
    oppgaveOpprettet: subWeeks(new Date(), 4).toISOString(),
    reservertTil: endOfDay(addDays(new Date(), 3)).toISOString(),
    tilordnetRessurs: undefined,
  },
];

export const fordeltOppgave: Oppgave[] = [
  {
    oppgaveId: 2856,
    saksnummer: '3456',
    behandlingstype: 'Førstegangsbehandling',
    behandlingsreferanse: '34456345',
    avklaringsbehov: 'AVKLAR_SYKDOM',
    status: 'OPPRETTET',
    foedselsnummer: '09837600004',
    avklaringsbehovOpprettetTid: subWeeks(new Date(), 4).toISOString(),
    behandlingOpprettetTid: subWeeks(new Date(), 4).toISOString(),
    oppgaveOpprettet: subWeeks(new Date(), 4).toISOString(),
    reservertTil: endOfDay(addDays(new Date(), 3)).toISOString(),
    tilordnetRessurs: 'Eklektisk Kappe',
  },
];
