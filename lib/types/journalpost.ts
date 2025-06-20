// TODO: Generere typer fra dokumentinnhenting api-kontrakt

export interface Journalpost {
  journalpostId: string;
  dokumenter: DokumentInfo[];
  tittel?: string;
  journalposttype: Journalposttype;
  journalstatus: Journalstatus;
  tema?: string;
  temanavn?: string;
  behandlingstema?: string;
  behandlingstemanavn?: string;
  sak?: JournalpostSak;
  avsenderMottaker?: AvsenderMottaker;
  datoOpprettet?: string;
  relevanteDatoer?: RelevantDato[];
}

interface JournalpostSak {
  sakstype: Sakstype;
  tema?: string;
  fagsaksystem?: string;
  fagsakId?: string;
}

enum Sakstype {
  FAGSAK = 'FAGSAK',
  GENERELL_SAK = 'GENERELL_SAK',
}

interface Dokumentvariant {
  variantformat: Variantformat;
  saksbehandlerHarTilgang: boolean;
}

export interface DokumentInfo {
  dokumentInfoId: string;
  tittel: string;
  brevkode?: string;
  dokumentvarianter: Dokumentvariant[];
}

interface AvsenderMottaker {
  id?: string;
  type?: AvsenderMottakerIdType;
  navn?: string;
}

enum AvsenderMottakerIdType {
  FNR = 'FNR',
  ORGNR = 'ORGNR',
  HPRNR = 'HPRNR',
  UTL_ORG = 'UTL_ORG',
  NULL = 'NULL',
  UKJENT = 'UKJENT',
}

interface RelevantDato {
  dato: string;
  datotype: Datotype;
}

enum Datotype {
  DATO_SENDT_PRINT = 'DATO_SENDT_PRINT',
  DATO_EKSPEDERT = 'DATO_EKSPEDERT',
  DATO_JOURNALFOERT = 'DATO_JOURNALFOERT',
  DATO_REGISTRERT = 'DATO_REGISTRERT',
  DATO_AVS_RETUR = 'DATO_AVS_RETUR',
  DATO_DOKUMENT = 'DATO_DOKUMENT',
  DATO_LEST = 'DATO_LEST',
}

enum Variantformat {
  ARKIV = 'ARKIV',
  FULLVERSJON = 'FULLVERSJON',
  PRODUKSJON = 'PRODUKSJON',
  PRODUKSJON_DLF = 'PRODUKSJON_DLF',
  SLADDET = 'SLADDET',
  ORIGINAL = 'ORIGINAL',
}

export enum Journalposttype {
  I = 'I',
  U = 'U',
  N = 'N',
}

export enum Journalstatus {
  MOTTATT = 'MOTTATT',
  JOURNALFOERT = 'JOURNALFOERT',
  FERDIGSTILT = 'FERDIGSTILT',
  EKSPEDERT = 'EKSPEDERT',
  UNDER_ARBEID = 'UNDER_ARBEID',
  FEILREGISTRERT = 'FEILREGISTRERT',
  UTGAAR = 'UTGAAR',
  AVBRUTT = 'AVBRUTT',
  UKJENT_BRUKER = 'UKJENT_BRUKER',
  RESERVERT = 'RESERVERT',
  OPPLASTING_DOKUMENT = 'OPPLASTING_DOKUMENT',
  UKJENT = 'UKJENT',
}
