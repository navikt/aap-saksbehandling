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

export type OppgaveKomplett = {
  id: number;
  tildeltEnhetsnr: string;
  endretAvEnhetsnr?: string;
  opprettetAvEnhetsnr?: string;
  journalpostId: string;
  behandlesAvApplikasjon: string;
  aktoerId: string;
  orgnr: string;
  tilordnetRessurs: string;
  beskrivelse: string;
  tema: string;
  behandlingstema: string;
  oppgavetype: string;
  behandlingstype: string;
  versjon: number;
  mappeId?: number;
  opprettetAv: string;
  endretAv: string;
  prioritet: string; // men egentlig prioritet
  status: string; // men egentlig status
  fristFerdigstillelse: string;
  aktivDato: string;
  opprettetTidspunkt: string;
  ferdigstiltTidspunkt: string;
  endretTidspunkt: string;
};
