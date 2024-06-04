import { getYear, parse } from 'date-fns';

export function validerÅrstall(val: string | string[]) {
  if (val.length !== 4) return 'Verdien må inneholde 4 siffer';
  const parsedDate = parse(val as string, 'yyyy', new Date());
  if (getYear(parsedDate) === Number(val)) {
    return true;
  } else {
    return 'Verdien er et ugyldig årstall';
  }
}
