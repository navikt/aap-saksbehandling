export enum Avklaringsbehovtype {
  MANUELT_SATT_PÅ_VENT = '9001',
  AVKLAR_STUDENT = '5001',
  AVKLAR_SYKDOM = '5003',
  FASTSETT_ARBEIDSEVNE = '5004',
  FRITAK_MELDEPLIKT = '5005',
  AVKLAR_BISTANDSBEHOV = '5006',
  VURDER_SYKEPENGEERSTATNING = '5007',
  FASTSETT_BEREGNINGSTIDSPUNKT = '5008',
  FORESLÅ_VEDTAK = '5098',
  FATTE_VEDTAK = '5099',
}

export type Oppgave = {
  versjon: number; // TODO ikke i backend pt
  oppgaveId: number;
  avklaringsbehov: Avklaringsbehovtype;
  status: 'OPPRETTET' | 'AVSLUTTET' | 'TOTRINNS_VURDERT' | 'SENDT_TILBAKE_FRA_BESLUTTER' | 'AVBRUTT';
  foedselsnummer: String; //innbygger
  avklaringsbehovOpprettetTid: string;
  behandlingOpprettetTid: string;
  tilordnetRessurs?: string;
  reservertTil?: string;
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
