export interface Tabellår {
  år: number;
  ferdigLignetPGI: number | null | undefined;
  beregnetPGI: number | null | undefined | string;
  eøsInntekt: number | null | undefined | string;
  label?: string;
  periodeFom?: string;
  periodeTom?: string;
  erDelperiode?: boolean;
  erKunVisning?: boolean;
}

export interface FastsettManuellInntektForm {
  begrunnelse: string;
  tabellår: Tabellår[];
}
