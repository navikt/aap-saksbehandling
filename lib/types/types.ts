export enum SakTilstand {
  'UNDER_BEHANDLING',
  'KVALITETSSIKRES',
  'FATTET',
  'VENTER_SYKEPENGER',
  'IVERKSATT',
}

interface Sak {
  saksid: string;
  søknadstidspunkt: string;
  tilstand?: SakTilstand;
  ansvarlig?: string;
  type: string;
}

export interface Søker {
  personident: string;
  fødselsdato: string;
  sak: Sak;
  skjermet: boolean;
  sisteVersjon: boolean;
}
