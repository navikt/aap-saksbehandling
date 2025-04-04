export function dagerTilMillisekunder(dager: number) {
  return dager * 24 * 60 * 60 * 1000;
}

export function sekunderTilDager(sekunder: number) {
  return (sekunder / (60 * 60 * 24)).toFixed(2);
}
