import { describe, test, expect } from 'vitest';
import { utledOppholdsstatus } from 'components/behandlinger/etannetsted/etAnnetStedUtil';
import { InstitusjonsoppholdResponse } from 'lib/types/types';
import { addDays, subDays, subWeeks } from 'date-fns';

describe('etAnnetStedUtil', () => {
  describe('utledOppholdsstatus', () => {
    test('periode med sluttdato i fortiden vises som Avsluttet', () => {
      const avsluttetOpphold: InstitusjonsoppholdResponse = {
        oppholdFra: subWeeks(new Date(), 10).toUTCString(),
        avsluttetDato: subDays(new Date(), 2).toUTCString(),
        institusjonstype: 'Sykehus',
        kildeinstitusjon: 'Et sted',
        oppholdstype: 'Heldøgnspasient',
        status: '',
      };

      const res = utledOppholdsstatus(avsluttetOpphold);
      expect(res).toEqual('Avsluttet');
    });

    test('periode med sluttdato frem i tid vises som Aktivt', () => {
      const aktivtOpphold: InstitusjonsoppholdResponse = {
        oppholdFra: subWeeks(new Date(), 2).toUTCString(),
        avsluttetDato: addDays(new Date(), 2).toUTCString(),
        institusjonstype: 'Sykehus',
        kildeinstitusjon: 'Et sted',
        oppholdstype: 'Heldøgnspasient',
        status: '',
      };

      const res = utledOppholdsstatus(aktivtOpphold);
      expect(res).toEqual('Aktivt');
    });

    test('periode med startdato i fortiden men uten sluttdato vises som Aktivt', () => {
      const aktivtOppholdUtenSluttdato: InstitusjonsoppholdResponse = {
        oppholdFra: subWeeks(new Date(), 2).toUTCString(),
        institusjonstype: 'Sykehus',
        kildeinstitusjon: 'Et sted',
        oppholdstype: 'Heldøgnspasient',
        status: '',
      };

      const res = utledOppholdsstatus(aktivtOppholdUtenSluttdato);
      expect(res).toEqual('Aktivt');
    });
  });
});
