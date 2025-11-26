import { Oppgave } from 'lib/types/oppgaveTypes';

export enum Adressebeskyttelsesgrad {
  STRENGT_FORTROLIG = 'Strengt fortrolig',
  FORTROLIG = 'Skjermet adresse',
  EGEN_ANSATT = 'Egen ansatt',
}

export enum Enhet {
  VIKAFOSSEN = '2103',
  NAV_VÆRNES = '1783',
}

export function utledAdressebeskyttelse(oppgave?: Oppgave): Adressebeskyttelsesgrad[] {
  let adressebeskyttelser = [];
  if (oppgave?.enhet == Enhet.VIKAFOSSEN) {
    adressebeskyttelser.push(Adressebeskyttelsesgrad.STRENGT_FORTROLIG);
  } else if (oppgave?.harFortroligAdresse) {
    adressebeskyttelser.push(Adressebeskyttelsesgrad.FORTROLIG);
  }

  // Det finnes én enhet som slutter på 83 som ikke er egen ansatt-enhet. TODO utled dette i backend isteden
  if (oppgave?.enhet.endsWith('83') && oppgave?.enhet != Enhet.NAV_VÆRNES) {
    adressebeskyttelser.push(Adressebeskyttelsesgrad.EGEN_ANSATT);
  }
  return adressebeskyttelser;
}
