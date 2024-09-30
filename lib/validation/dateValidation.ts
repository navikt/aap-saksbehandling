import { isFuture, parse } from 'date-fns';
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

export function erDatoFoerDato(inputDato: string, referanseDato: string): boolean {
  return (
    new Date(parse(inputDato as string, 'dd.MM.yyyy', new Date())) <
    new Date(parse(referanseDato, 'dd.MM.yyyy', new Date()))
  );
}

export function erDatoIFremtiden(value: string): boolean {
  return isFuture(parse(value as string, 'dd.MM.yyyy', new Date()));
}
