export const numberToString = (value?: number | null) => (value ? `${value}` : undefined);

export const storForbokstav = (value: string): string => {
  return value.charAt(0).toUpperCase().concat(value.slice(1).toLowerCase());
};
