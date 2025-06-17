import { Journalstatus } from 'lib/types/journalpost';

export const erFerdigstilt = (status: Journalstatus) => {
  switch (status) {
    case 'JOURNALFOERT':
    case 'FERDIGSTILT':
    case 'FEILREGISTRERT':
      return true;
    default:
      return false;
  }
}

export const kanRedigeres = (status: Journalstatus) => {
  switch (status) {
    case 'MOTTATT':
    case 'UNDER_ARBEID':
      return true;
    default:
      return false;
  }
};
