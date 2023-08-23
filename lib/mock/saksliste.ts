import { SakTilstand, Søker } from '../types/types';
import { subDays } from 'date-fns';

export const listeMedSøkereOgSaker: Søker[] = [
  {
    personident: '01090200432',
    sisteVersjon: true,
    fødselsdato: '1976-03-08',
    skjermet: false,
    sak: {
      saksid: 'uuid-2',
      søknadstidspunkt: '2022-04-12T08:19:00',
      type: 'STANDARD',
      tilstand: SakTilstand['UNDER_BEHANDLING'],
    },
  },
  {
    personident: '10987654322',
    sisteVersjon: true,
    fødselsdato: '1996-03-08',
    skjermet: true,
    sak: {
      saksid: 'uuid-4',
      søknadstidspunkt: '2022-05-05T04:49:23',
      type: 'STANDARD',
      tilstand: SakTilstand['FATTET'],
    },
  },
  {
    personident: '06826999576',
    sisteVersjon: true,
    fødselsdato: '1969-02-06',
    skjermet: true,
    sak: {
      saksid: 'uuid-3',
      søknadstidspunkt: '2022-05-05T20:23:25',
      type: 'STANDARD',
    },
  },
  {
    personident: '12838121301',
    sisteVersjon: true,
    fødselsdato: '1981-03-12',
    skjermet: false,
    sak: {
      saksid: 'uuid-9345',
      søknadstidspunkt: subDays(new Date(), 38).toISOString(),
      type: 'STANDARD',
    },
  },
  {
    personident: '409876543219',
    sisteVersjon: true,
    fødselsdato: '1986-03-08',
    skjermet: false,
    sak: {
      saksid: 'uuid-1',
      søknadstidspunkt: '2022-03-25T12:22:43',
      type: 'STANDARD',
      tilstand: SakTilstand['KVALITETSSIKRES'],
    },
  },
];
