import { getYear, parse } from 'date-fns';
export function validerÅrstall(val: string | string[], errorMessage: string) {
  if (val.length !== 4) return errorMessage;
  const parsedDate = parse(val as string, 'yyyy', new Date());
  if (getYear(parsedDate) === Number(val)) {
    return true;
  }
  return errorMessage;
}
