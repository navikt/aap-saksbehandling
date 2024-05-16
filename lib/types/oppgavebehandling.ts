export type Oppgave = {
  versjon: number; // TODO ikke i backend pt
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
