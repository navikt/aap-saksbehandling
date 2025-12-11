export interface Tabellår {
  år: number;
  ferdigLignetPGI: number | null | undefined;
  beregnetPGI: number | null | undefined;
  eøsInntekt: number | null | undefined;
  totalInntekt: number | null | undefined;
}

export interface FastsettManuellInntektForm {
  begrunnelse: string;
  tabellår: Tabellår[];
}
