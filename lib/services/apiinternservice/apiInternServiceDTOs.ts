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

export type ArenaSakPerson = {
  personId: number;
  fodselsnummer: string;
  fornavn: string;
  etternavn: string;
};

export type ArenaVedtakfakta = {
  kode: string;
  navn: string;
  verdi: string | null;
  registrertDato: string;
};

export type ArenaVedtakDetaljer = {
  vedtakId: number;
  lopenrvedtak: number;
  statusKode: string;
  statusNavn: string;
  vedtaktypeKode: string;
  vedtaktypeNavn: string;
  aktivitetsfaseKode: string;
  aktivitetsfaseNavn: string;
  fraOgMed: string | null;
  tilDato: string | null;
  rettighetkode: string;
  rettighetnavn: string;
  utfallkode: string | null;
  begrunnelse: string | null;
  saksbehandler: string | null;
  beslutter: string | null;
  relatertVedtak: number | null;
  fakta: ArenaVedtakfakta[];
};

export type ArenaSakMedVedtakResponse = {
  sakId: string;
  opprettetAar: number;
  lopenr: number;
  person: ArenaSakPerson;
  statuskode: string;
  statusnavn: string;
  registrertDato: string;
  avsluttetDato: string | null;
  vedtak: ArenaVedtakDetaljer[];
};
