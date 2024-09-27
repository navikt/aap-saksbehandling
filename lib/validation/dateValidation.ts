import { parseDatoFraDatePicker } from 'lib/utils/date';

export function validerDato(value?: string) {
  if (!value) {
    return 'Du må sette en dato';
  }
  const inputDato = parseDatoFraDatePicker(value);
  if (!inputDato) {
    return 'Dato format er ikke gyldig. Dato må være på formatet dd.mm.åååå';
  }
}
