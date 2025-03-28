import { ValuePair } from 'components/form/FormField';

export enum JaEllerNei {
  Ja = 'ja',
  Nei = 'nei',
}

export enum JaNeiIkkeOppgitt {
  JA = 'Ja',
  NEI = 'Nei',
  IKKE_OPPGITT = 'Ikke oppgitt',
}

export const JaNeiEllerIkkeOppgittOptions: ValuePair[] = [
  { label: 'Ja', value: JaNeiIkkeOppgitt.JA },
  { label: 'Nei', value: JaNeiIkkeOppgitt.NEI },
  { label: 'Ikke oppgitt', value: JaNeiIkkeOppgitt.IKKE_OPPGITT },
];

export function stringToJaNeiIkkeOppgitt(value: string) {
  switch (value) {
    case 'Ja':
      return JaNeiIkkeOppgitt.JA;
    case 'Nei':
      return JaNeiIkkeOppgitt.NEI;
    case 'Ikke oppgitt':
      return JaNeiIkkeOppgitt.IKKE_OPPGITT;
  }
}
export enum JaNeiVetIkke {
  JA = 'Ja',
  NEI = 'Nei',
  VET_IKKE = 'Vet ikke',
}

export const JaNeiEllerVetIkkeOptions: ValuePair[] = [
  { label: 'Ja', value: JaNeiVetIkke.JA },
  { label: 'Nei', value: JaNeiVetIkke.NEI },
  { label: 'Vet ikke', value: JaNeiVetIkke.VET_IKKE },
];

export function stringToJaNeiVetikke(value: string) {
  switch (value) {
    case 'Ja':
      return JaNeiVetIkke.JA;
    case 'Nei':
      return JaNeiVetIkke.NEI;
    case 'Vet ikke':
      return JaNeiVetIkke.VET_IKKE;
  }
}
export enum JaNeiAvbruttIkkeOppgitt {
  JA = 'Ja',
  NEI = 'Nei',
  AVBRUTT = 'Avbrutt',
  IKKE_OPPGITT = 'Ikke oppgitt',
}

export const JaNeiAbruttEllerIkkeOpgittOptions: ValuePair[] = [
  { label: 'Ja', value: JaNeiAvbruttIkkeOppgitt.JA },
  { label: 'Nei', value: JaNeiAvbruttIkkeOppgitt.NEI },
  { label: 'Avbrutt', value: JaNeiAvbruttIkkeOppgitt.AVBRUTT },
  { label: 'Ikke oppgitt', value: JaNeiAvbruttIkkeOppgitt.IKKE_OPPGITT },
];

export function stringToJaNeiAvbruttIkkeOppgitt(value: string) {
  switch (value) {
    case 'Ja':
      return JaNeiAvbruttIkkeOppgitt.JA;
    case 'Nei':
      return JaNeiAvbruttIkkeOppgitt.NEI;
    case 'Avbrutt':
      return JaNeiAvbruttIkkeOppgitt.AVBRUTT;
    case 'Ikke oppgitt':
      return JaNeiAvbruttIkkeOppgitt.IKKE_OPPGITT;
  }
}

export const JaEllerNeiOptions: ValuePair[] = [
  { label: 'Ja', value: JaEllerNei.Ja },
  { label: 'Nei', value: JaEllerNei.Nei },
];

export enum Behovstype {
  KATEGORISER_DOKUMENT = '1337',
  DIGITALISER_DOKUMENT = '1338',
  AVKLAR_TEMA = '1339',
  FINN_SAK = '1340',
  AVKLAR_OVERLEVERING = '1341',
}
export const getJaNeiEllerUndefined = (value?: boolean | null): JaEllerNei | undefined => {
  if (value === null || value === undefined) {
    return undefined;
  }
  return value ? JaEllerNei.Ja : JaEllerNei.Nei;
};
