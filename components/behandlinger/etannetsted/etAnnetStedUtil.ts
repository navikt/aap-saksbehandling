import { InstitusjonsoppholdResponse } from 'lib/types/types';
import { isAfter, isBefore } from 'date-fns';

export const utledOppholdsstatus = (opphold: InstitusjonsoppholdResponse) => {
  const iDag = new Date();
  const avsluttetDato = opphold.avsluttetDato && new Date(opphold.avsluttetDato);
  const oppholdErAvsluttet = avsluttetDato && isBefore(avsluttetDato, iDag);
  const oppholdErAktivt =
    (avsluttetDato && isAfter(avsluttetDato, iDag)) || (!avsluttetDato && isBefore(new Date(opphold.oppholdFra), iDag));
  if (oppholdErAvsluttet) {
    return 'Avsluttet';
  }
  if (oppholdErAktivt) {
    return 'Aktivt';
  }
};
