import { format, isValid, parse, parseISO } from 'date-fns';
import { nb } from 'date-fns/locale';

const DD_MM_YYYY = /\d{2}\.\d{2}\.\d{4}/;
const YYYY_MM_DD = /^\d{4}-\d{2}-\d{2}$/;
const ISO_8601 = /^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}.*?Z$/;

export class Dato {
  dato: Date;

  constructor(dato: string);
  constructor(dato: Date);
  constructor(dato: string | Date) {
    if (dato instanceof Date) {
      this.dato = dato;
    } else {
      if (dato.match(DD_MM_YYYY)) {
        this.dato = parse(dato, 'dd.MM.yyyy', new Date(), { locale: nb });
      } else if (dato.match(YYYY_MM_DD)) {
        this.dato = parse(dato, 'yyyy-MM-dd', new Date(), { locale: nb });
      } else if (dato.match(ISO_8601)) {
        this.dato = parseISO(dato);
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
