import { ValuePair } from 'components/input/formfield/FormField';

export enum Behovstype {
  MANUELT_SATT_PÅ_VENT_KODE = '9001',
  AVKLAR_STUDENT_KODE = '5001',
  AVKLAR_SYKDOM_KODE = '5003',
  FASTSETT_ARBEIDSEVNE_KODE = '5004',
  FRITAK_MELDEPLIKT_KODE = '5005',
  AVKLAR_BISTANDSBEHOV_KODE = '5006',
  VURDER_SYKEPENGEERSTATNING_KODE = '5007',
  FASTSETT_BEREGNINGSTIDSPUNKT_KODE = '5008',
  FORESLÅ_VEDTAK_KODE = '5098',
  FATTE_VEDTAK_KODE = '5099',
  KVALITETSSIKRING_KODE = '5097',
}

type BehovsKode = `${Behovstype}`;

export function mapBehovskodeTilBehovstype(kode: BehovsKode): string {
  switch (kode) {
    case '5001':
      return '§ 11-14 Avklar student';
    case '5003':
      return '§ 11-5 Avklar sykdom';
    case '5004':
      return '§ 11- 23 2.ledd Fastsett arbeidsevne';
    case '5005':
      return '§ 11-10 Fritak meldeplikt';
    case '5006':
      return '§ 11-6 Avklar bistandsbehov';
    case '5007':
      return '§ 11 -13 Vurder sykepengeerstatning';
    case '5008':
      return 'Fastsett beregningstidspunkt';
    case '5098':
      return 'Foreslå vedtak';
    case '5099':
      return 'Fatte vedtak';
    case '5097':
      return 'Kvalitetssikring';
    case '9001':
      return 'Manuelt satt på vent';
  }
}

export enum JaEllerNei {
  Ja = 'ja',
  Nei = 'nei',
}

export const JaEllerNeiOptions: ValuePair[] = [
  { label: 'Ja', value: JaEllerNei.Ja },
  { label: 'Nei', value: JaEllerNei.Nei },
];

export const getValueFromBooleanUndefinedNull = (value?: boolean | null) => {
  if (value === undefined || value === null) {
    return undefined;
  }

  return value ? 'true' : 'false';
};

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
