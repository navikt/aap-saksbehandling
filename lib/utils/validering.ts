export function erProsent(value: number): boolean {
  return value >= 0 && value <= 100;
}

export const isNullOrUndefined = (value: number | null | undefined) => value === null || value === undefined;
