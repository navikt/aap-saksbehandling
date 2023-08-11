import { isValid, parseISO } from 'date-fns';

export interface Dokument {
  journalpostId?: string;
  dokumentId?: string;
  tittel: string;
  type: 'I' | 'U' | 'N';
  innsendingsId: string;
  dato: string;
}

export enum sakTilstandEnum {
  'UNDER_BEHANDLING',
  'KVALITETSSIKRES',
  'FATTET',
  'VENTER_SYKEPENGER',
  'IVERKSATT',
}

interface sakSchema {
  saksid: string;
  søknadstidspunkt: string;
  tilstand?: sakTilstandEnum;
  ansvarlig?: string; // TODO Sette opp granulert tildeling (flere personer kan "eie") aktiv / venter, Denne ligger ikke i modellen
  type: string; // 11-5, SP-erstattning, Student, Uføre
  aktiv?: boolean; // TODO Hva betyr egentlig dette? Tilstand? Bruke eksplisitte booleans?, Denne ligger ikke i modellen
}

const refineDato = (dato: string) => isValid(parseISO(dato));

export interface søkerSchema {
  personident: string;
  fødselsdato: string;
  sak: sakSchema;
  skjermet: boolean;
  sisteVersjon: boolean;
}
