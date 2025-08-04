const controlDigits = [3, 2, 7, 6, 5, 4, 3, 2];

const mod11 = (arr: number[], value: string): number => {
  const sum = arr.map((v, i) => v * Number(value[i])).reduce((prevNum, currNum) => prevNum + currNum);

  const result = 11 - (sum % 11);

  if (result === 11) return 0;
  else return result;
};

const validerKontrollsiffer = (value: string): boolean => {
  const kontrollsiffer = Number(value[8]);

  return kontrollsiffer === mod11(controlDigits, value);
};

/**
 * Funksjon som sjekker om et organisasjonsnummer er gyldig.
 * Bruker kontrollsiffer for å validere.
 **/
export const erGyldigOrganisasjonsnummer = (value: string | undefined): boolean => {
  if (!/^\d{9}$/.test(value ?? '') || /^0+$/.test(value ?? ''))
    // hvis orgnr ikke består av 9 siffer
    return false;
  else return validerKontrollsiffer(value!!);
};
