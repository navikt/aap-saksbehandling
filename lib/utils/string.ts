export const numberToString = (value?: number | null) => (value ? `${value}` : undefined);

export const storForbokstav = (value: string): string => {
  return value.charAt(0).toUpperCase().concat(value.slice(1).toLowerCase());
};

export function formaterTilNok(sum: number): string {
  return `${sum.toLocaleString(`nb-NO`)} kr`;
}

export function formaterTilG(sum: number): string {
  const formatedSum = sum.toFixed(2);
  if (formatedSum.endsWith('.00')) {
    return `${formatedSum.slice(0, -3)} G`;
  }
  return `${formatedSum} G`;
}

export function formaterTilProsent(sum: number): string {
  return `${sum} %`;
}
