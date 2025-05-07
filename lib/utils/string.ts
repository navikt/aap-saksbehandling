export const numberToString = (value?: number | null) => (value ? `${value}` : undefined);

export const storForbokstav = (value: string): string => {
  return value.charAt(0).toUpperCase().concat(value.slice(1).toLowerCase());
};

export function formaterTilNok(sum: number): string {
  return `${sum.toLocaleString(`nb-NO`)} kr`;
}

export function formaterTilG(sum: number): string {
  const formatedSum = sum.toFixed(3);
  if (formatedSum.endsWith('.000')) {
    return `${formatedSum.slice(0, -4)} G`;
  }
  return `${formatedSum} G`;
}

export function formaterTilProsent(sum: number): string {
  return `${sum} %`;
}
