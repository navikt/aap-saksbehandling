export function sekunderTilDager(sekunder: number) {
  return (sekunder / (60 * 60 * 24)).toFixed(2);
}
