export interface Tabellår {
  år: number;
  ferdigLignetPGI: number | null | undefined;
  beregnetPGI: number | null | undefined | string;
  eøsInntekt: number | null | undefined | string;
}

export interface FastsettManuellInntektForm {
  begrunnelse: string;
  tabellår: Tabellår[];
}
