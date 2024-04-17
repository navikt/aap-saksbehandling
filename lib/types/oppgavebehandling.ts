export type Oppgave = {
  // felt som ikke finnes i backend pt
  navn: string;
  søknadstype: string;
  type: string;
  saksbehandler?: string;
  // faktiske felt
  oppgaveId: number;
  oppgavetype: string;
  foedselsnummer: string;
  opprettet: string;
  reservertTil: string;
  versjon: number;
};

export type Oppgaver = {
  oppgaver: Oppgave[];
};
