import { components } from './schema';

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

export type BehandlingsInfo = components['schemas']['BehandlinginfoDTO'];
export type DetaljertBehandling = components['schemas']['DetaljertBehandlingDTO'];
export type AvklaringsBehov = components['schemas']['AvklaringsbehovDTO'];
export type EndringDto = components['schemas']['EndringDTO'];
export type FinnSakForIdent = components['schemas']['FinnSakForIdentDTO'];
export type OpprettTestcase = components['schemas']['OpprettTestcaseDTO'];
export type Periode = components['schemas']['Periode'];
export type UtvidetSaksInfo = components['schemas']['UtvidetSaksinfoDTO'];
export type SaksInfo = components['schemas']['SaksinfoDTO'];
