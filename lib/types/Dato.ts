import { format, isValid, parse } from 'date-fns';

export class Dato {
  dato: Date;

  constructor(dato: string);
  constructor(dato: Date);
  constructor(dato: string | Date) {
    if (dato instanceof Date) {
      this.dato = dato;
    } else {
      if (dato.match(/\d{2}\.\d{2}\.\d{4}/)) {
        this.dato = parse(dato, 'dd.MM.yyyy', new Date());
      } else if (dato.match(/\d{4}-\d{2}-\d{2}/)) {
        this.dato = parse(dato, 'yyyy-MM-dd', new Date());
      } else {
        throw Error('Ugyldig datoformat');
      }
    }
    if (!isValid(this.dato)) {
      throw Error('Ugyldig dato');
    }
  }

  formaterForFrontend() {
    return format(this.dato, 'dd.MM.yyyy');
  }

  formaterForBackend() {
    return format(this.dato, 'yyyy-MM-dd');
  }
}
