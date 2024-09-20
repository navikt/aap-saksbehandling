import { getYear, parse, isValid } from 'date-fns';

export function validerÅrstall(val: string | string[]) {
  if (val.length !== 4) return 'Verdien må inneholde 4 siffer';
  const parsedDate = parse(val as string, 'yyyy', new Date());
  if (getYear(parsedDate) === Number(val)) {
    return true;
  } else {
    return 'Verdien er et ugyldig årstall';
  }
}

export function validerGyldigDato(val: string) {
  const pattern = new RegExp(/^\d{2}.\d{2}.\d{4}/);
  if (!pattern.test(val)) {
    return 'Ugyldig format på dato. Formatet må være dd.mm.åååå';
  }
  const dato = parse(val, 'dd.MM.yyyy', new Date());
  return isValid(dato) ? true : 'Ugyldig dato';
}
