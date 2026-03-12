type FlatError = { name: string; message: string; index?: number };

export type ErrorList = FlatError[];

export function finnesFeilForVurdering(index: number, errorList: ErrorList) {
  return !!errorList.find((err) => err.index === index);
}

/**
 * Funksjon for å hente ut feilmeldinger fra formstate i react hook form.
 * @param errors må være fra errors objektet til rhf (form.formstate.errors)
 */
export function hentFeilmeldingerForForm(errors: unknown): FlatError[] {
  const flatErrors: FlatError[] = [];

  function samleFeilmeldinger(obj: any, index?: number) {
    if (!obj) return;

    if (Array.isArray(obj)) {
      obj.forEach((item, i) => samleFeilmeldinger(item, i));
      return;
    }

    if (typeof obj === 'object') {
      if (obj.message && obj.ref?.name) {
        flatErrors.push({
          name: obj.ref.name,
          message: obj.message,
          index,
        });
      }

      Object.values(obj).forEach((value) => samleFeilmeldinger(value, index));
    }
  }

  samleFeilmeldinger(errors);
  return flatErrors;
}
