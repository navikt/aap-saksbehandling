import { ValuePair } from '@navikt/aap-felles-react';

export enum JaEllerNei {
  Ja = 'ja',
  Nei = 'nei',
}
export function stringToJaEllerNei(value: string) {
  switch (value) {
    case 'ja':
      return JaEllerNei.Ja;
    case 'nei':
      return JaEllerNei.Nei;
  }
}

export enum JaNeiIkkeOppgitt {
  JA = 'Ja',
  NEI = 'Nei',
  IKKE_OPPGITT = 'Ikke oppgitt',
}
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
export enum JaNeiAvbrutt {
  JA = 'Ja',
  NEI = 'Nei',
  AVBRUTT = 'Avbrutt',
}
export function stringToJaNeiAvbrutt(value: string) {
  switch (value) {
    case 'Ja':
      return JaNeiAvbrutt.JA;
    case 'Nei':
      return JaNeiAvbrutt.NEI;
    case 'Avbrutt':
      return JaNeiAvbrutt.AVBRUTT;
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
