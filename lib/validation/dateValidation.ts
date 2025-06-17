import { getYear, isFuture, isValid, parse } from 'date-fns';
import { parseDatoFraDatePicker } from 'lib/utils/date';

export function validerDato(value?: string) {
  if (!value) {
    return 'Du må sette en dato';
  }

  if (!new RegExp(/^\d{2}\.\d{2}\.\d{4}$/).test(value)) {
    return 'Datoformatet er ikke gyldig. Dato må være på formatet dd.mm.åååå';
  }

  const inputDato = parseDatoFraDatePicker(value);
  if (!inputDato) {
    return 'Datoen er ikke gyldig';
  }
}

export function erDatoFoerDato(inputDato: string, referanseDato: string): boolean {
  const parsedInputDato = new Date(parse(inputDato, 'dd.MM.yyyy', new Date()));
  const parsedReferanseDato = new Date(parse(referanseDato, 'dd.MM.yyyy', new Date()));

  if (!isValid(parsedInputDato)) {
    throw new Error('input dato er ikke gyldig');
  }

  if (!isValid(parsedReferanseDato)) {
    throw new Error('referanse dato er ikke gyldig');
  }

  return parsedInputDato < parsedReferanseDato;
}

export function erDatoIFremtiden(value: string): boolean {
  return value == undefined ? false : isFuture(parse(value as string, 'dd.MM.yyyy', new Date()));
}

export function validerÅrstall(val: string | string[]) {
  if (val.length !== 4) return 'Verdien må inneholde 4 siffer';
  const parsedDate = parse(val as string, 'yyyy', new Date());
  if (getYear(parsedDate) === Number(val)) {
    return true;
  } else {
    return 'Verdien er et ugyldig årstall';
  }
}
