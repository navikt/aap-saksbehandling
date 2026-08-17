// TODO: Ha dette i egen fil eller i en annen, f.eks. journalpost?

import { DokumentInfo } from 'lib/types/journalpost';
import { DokumentasjonType } from 'components/dialogmedbehandler/Melding';

export enum InnkommendeUtgaaende {
  INNKOMMENDE = 'INNKOMMENDE',
  UTGÅENDE = 'UTGÅENDE',
}

export enum DialogmeldingLeveringStatus {
  SENDT = 'SENDT',
  LEVERT = 'LEVERT',
  FEILET = 'FEILET',
}

export interface FellesDialogmeldingDto {
  innkommendeUtgaaende: InnkommendeUtgaaende;
  meldingFraNavn: string;
  opprettetTidspunkt: Date;
  dokumentasjonsType?: DokumentasjonType;
  tekst?: string;
  meldingStatus?: DialogmeldingLeveringStatus;
  journalpostId?: string;
  dokumentIdListe: DokumentInfo[];
}
