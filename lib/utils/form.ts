export enum JaEllerNei {
  Ja = 'ja',
  Nei = 'nei',
}

export enum BehovsType {
  SYKDOMSVURDERING = 5001,
  YRKESSKADE = 5002,
}

export const getJaNeiEllerUndefined = (value?: boolean | null) => {
  if (value === undefined || value === null) {
    return undefined;
  }
  return value ? JaEllerNei.Ja : JaEllerNei.Nei;
};
