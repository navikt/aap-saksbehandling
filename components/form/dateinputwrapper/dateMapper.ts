/**
 * konverterer en dato på formatet ddmmyy til dd.mm.yyyy
 * årstall inntill 90 år tilbake i tid antar vi skal starte med 19
 * Gir input tilbake dersom det ikke er kun tall eller noe annet enn 6 tegn
 */
export const mapShortDateToDateString = (input: string): string => {
  const inputIsNumeric = /^\d+$/.test(input);
  if (!inputIsNumeric || input.length !== 6) {
    return input;
  }

  const date = input.substring(0, 2);
  const month = input.substring(2, 4);

  const year = Number.parseInt(input.substring(4), 10);
  const flipYear = new Date().getFullYear() - 90;
  const shortFlipYear = flipYear % 100;
  const fullYear = year > shortFlipYear ? 1900 + year : 2000 + year;

  return `${date}.${month}.${fullYear}`;
};
