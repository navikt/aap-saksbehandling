export type Oppgave = {
  oppgaveId: number;
  saksnummer: string;
  behandlingstype: string;
  behandlingsreferanse: string;
  avklaringsbehov: string;
  status: 'OPPRETTET' | 'AVSLUTTET' | 'TOTRINNS_VURDERT' | 'SENDT_TILBAKE_FRA_BESLUTTER' | 'AVBRUTT';
  foedselsnummer: String; //innbygger
  avklaringsbehovOpprettetTid: string;
  behandlingOpprettetTid: string;
  oppgaveOpprettet: string;
  tilordnetRessurs?: string;
  reservertTil?: string;
};

export type Oppgaver = {
  oppgaver: Oppgave[];
};

export type FilterDTO = {
  id: number;
  tittel: string;
  beskrivelse: string;
  filter: string; //JSON som må parses
};
