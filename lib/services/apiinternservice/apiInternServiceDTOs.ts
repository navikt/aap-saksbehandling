export type ArenaoppslagSakerRequestV1 = {
  personidentifikator: string;
};

export type ArenaSakOppsummeringKontrakt = {
  sakId: string;
  lopenummer: number;
  aar: number;
  antallVedtak: number;
  statuskode: string;
  statusnavn: string;
  sakstype: string;
  regDato: string;
  avsluttetDato: string | null;
};

export type SakerResponse = {
  saker: ArenaSakOppsummeringKontrakt[];
};
