/**
 * Beregner 1. påskedag (påskesøndag) for et gitt år ved hjelp av Meeus/Jones/Butcher-algoritmen
 * (den anonyme gregorianske algoritmen). Gir korrekt dato for alle år i den gregorianske
 * kalenderen, uten behov for årlige oppdateringer eller spesialtilfeller.
 *
 * Se https://en.wikipedia.org/wiki/Date_of_Easter#Anonymous_Gregorian_algorithm
 */
export function beregnPåskedag(år: number): Date {
  const a = år % 19;
  const b = Math.floor(år / 100);
  const c = år % 100;
  const d = Math.floor(b / 4);
  const e = b % 4;
  const f = Math.floor((b + 8) / 25);
  const g = Math.floor((b - f + 1) / 3);
  const h = (19 * a + b - d - g + 15) % 30;
  const i = Math.floor(c / 4);
  const k = c % 4;
  const l = (32 + 2 * e + 2 * i - h - k) % 7;
  const m = Math.floor((a + 11 * h + 22 * l) / 451);
  const måned = Math.floor((h + l - 7 * m + 114) / 31);
  const dag = ((h + l - 7 * m + 114) % 31) + 1;

  return new Date(år, måned - 1, dag);
}
