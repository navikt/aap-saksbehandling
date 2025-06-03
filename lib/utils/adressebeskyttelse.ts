import { Oppgave } from 'lib/types/oppgaveTypes';

export enum Adressebeskyttelsesgrad {
  STRENGT_FORTROLIG = 'Strengt fortrolig',
  FORTROLIG = 'Skjermet adresse',
  EGEN_ANSATT = 'Egen ansatt',
}

export enum Enhet {
  VIKAFOSSEN = '2103',
}

export function utledAdressebeskyttelse(oppgave?: Oppgave): Adressebeskyttelsesgrad[] {
  let adressebeskyttelser = [];
  if (oppgave?.enhet == Enhet.VIKAFOSSEN) {
    adressebeskyttelser.push(Adressebeskyttelsesgrad.STRENGT_FORTROLIG);
  } else if (oppgave?.harFortroligAdresse) {
    adressebeskyttelser.push(Adressebeskyttelsesgrad.FORTROLIG);
  }

  if (oppgave?.enhet.endsWith('83')) {
    adressebeskyttelser.push(Adressebeskyttelsesgrad.EGEN_ANSATT);
  }
  return adressebeskyttelser;
}
