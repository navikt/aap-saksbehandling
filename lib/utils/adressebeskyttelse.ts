import { SkjermingInfo } from 'lib/types/oppgaveTypes';

export enum Adressebeskyttelsesgrad {
  STRENGT_FORTROLIG = 'Strengt fortrolig',
  FORTROLIG = 'Skjermet adresse',
  EGEN_ANSATT = 'Egen ansatt',
}

export function utledAdressebeskyttelse(skjermingInfo?: SkjermingInfo): Adressebeskyttelsesgrad[] {
  let adressebeskyttelser = [];
  if (skjermingInfo?.harStrengtFortroligAdresse) {
    adressebeskyttelser.push(Adressebeskyttelsesgrad.STRENGT_FORTROLIG);
  } else if (skjermingInfo?.harFortroligAdresse) {
    adressebeskyttelser.push(Adressebeskyttelsesgrad.FORTROLIG);
  }

  if (skjermingInfo?.erSkjermet) {
    adressebeskyttelser.push(Adressebeskyttelsesgrad.EGEN_ANSATT);
  }
  return adressebeskyttelser;
}
