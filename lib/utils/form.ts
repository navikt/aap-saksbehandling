export enum JaEllerNei {
  Ja = 'ja',
  Nei = 'nei',
}

export enum BehovsType {
  AVKLAR_STUDENT = '5001',
  YRKESSKADE = '5002',
  SYKDOMSVURDERING = '5003',
  FASTSETT_ARBEIDSEVNE = '5004',
  FRITAK_MELDEPLIKT = '5005',
  AVKLAR_BISTANDSBEHOV = '5006',
  SYKEPENGEERSTATNING = '5007',
  FORESLÅ_VEDTAK = '5098',
  FATTE_VEDTAK = '5099',
  MANUELT_SATT_PÅ_VENT = '9001',
}

export const getJaNeiEllerUndefined = (value?: boolean | null) => {
  if (value === undefined || value === null) {
    return undefined;
  }
  return value ? JaEllerNei.Ja : JaEllerNei.Nei;
};

export const getStringEllerUndefined = (value?: number | string | null) => {
  if (value === undefined || value === null) {
    return undefined;
  }
  return value.toString();
};
