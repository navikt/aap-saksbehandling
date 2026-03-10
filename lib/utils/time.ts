export const TID_MAKS_BACKEND_STRING = '2999-01-01';

export function dagerTilMillisekunder(dager: number) {
  return dager * 24 * 60 * 60 * 1000;
}

export function sekunderTilDager(sekunder: number) {
  return (sekunder / (60 * 60 * 24)).toFixed(0);
}
