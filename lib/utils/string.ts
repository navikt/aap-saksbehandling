export const numberToString = (value?: number | null) => (value ? `${value}` : undefined);

export const storForbokstav = (value: string): string => {
  return value.charAt(0).toUpperCase().concat(value.slice(1).toLowerCase());
};

export function formaterTilNok(sum: number): string {
  return `${sum.toLocaleString(`nb-NO`)} kr`;
}

export function formaterTilG(sum: number): string {
  const formatedSum = sum.toLocaleString(undefined, { maximumFractionDigits: 2 });
  return `${formatedSum} G`;
}

export function formaterTilProsent(sum: number): string {
  return `${sum} %`;
}
