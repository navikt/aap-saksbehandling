import { Journalposttype, Journalstatus } from 'lib/types/journalpost';

export const erFerdigstilt = (status: Journalstatus) => {
  switch (status) {
    case 'JOURNALFOERT':
    case 'FERDIGSTILT':
    case 'FEILREGISTRERT':
      return true;
    default:
      return false;
  }
};

export const kanRedigeres = (status: Journalstatus) => {
  switch (status) {
    case 'MOTTATT':
    case 'UNDER_ARBEID':
      return true;
    default:
      return false;
  }
};

export const formaterJournalpostType = (type: Journalposttype) => {
  switch (type) {
    case Journalposttype.I:
      return 'Inngående';
    case Journalposttype.U:
      return 'Utgående';
    case Journalposttype.N:
      return 'Notat';
  }
};

export const formaterJournalstatus = (status: Journalstatus) => {
  switch (status) {
    case Journalstatus.UTGAAR:
      return 'Utgår';
    case Journalstatus.UNDER_ARBEID:
      return 'Under arbeid';
    case Journalstatus.UKJENT_BRUKER:
      return 'Ukjent bruker';
    case Journalstatus.UKJENT:
      return 'Ukjent';
    case Journalstatus.RESERVERT:
      return 'Reservert';
    case Journalstatus.OPPLASTING_DOKUMENT:
      return 'Opplasting dokument';
    case Journalstatus.MOTTATT:
      return 'Mottatt';
    case Journalstatus.JOURNALFOERT:
      return 'Journalført';
    case Journalstatus.FERDIGSTILT:
      return 'Ferdigstilt';
    case Journalstatus.FEILREGISTRERT:
      return 'Feilregistrert';
    case Journalstatus.EKSPEDERT:
      return 'Ekspedert';
    case Journalstatus.AVBRUTT:
      return 'Avbrutt';
  }
};
