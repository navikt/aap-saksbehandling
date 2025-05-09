export function storForbokstavIHvertOrd(value?: string | null): string {
  if (!value) {
    return '';
  }

  const ord = value.split(' ');
  const ordMedStorForbokstav = ord.map((ord) => storForbokstav(ord));
  return ordMedStorForbokstav.join(' ');
}

export function storForbokstav(value: string): string {
  return value.charAt(0).toUpperCase().concat(value.slice(1).toLowerCase());
}

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
