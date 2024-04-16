export type Oppgave = {
  navn: string;
  søknadstype: string;
  type: string;
  opprettet: string;
  reservertTil: string;
  saksbehandler?: string;
};

export type Oppgaver = {
  oppgaver: Oppgave[];
};
