import { ValuePair } from 'components/form/FormField';

export enum Behovstype {
  MANUELT_SATT_PÅ_VENT_KODE = '9001',
  AVKLAR_STUDENT_KODE = '5001',
  AVKLAR_SYKDOM_KODE = '5003',
  FASTSETT_ARBEIDSEVNE_KODE = '5004',
  FRITAK_MELDEPLIKT_KODE = '5005',
  AVKLAR_BISTANDSBEHOV_KODE = '5006',
  VURDER_SYKEPENGEERSTATNING_KODE = '5007',
  FASTSETT_BEREGNINGSTIDSPUNKT_KODE = '5008',
  AVKLAR_BARNETILLEGG_KODE = '5009',
  AVKLAR_SONINGSFORRHOLD = '5010',
  AVKLAR_HELSEINSTITUSJON = '5011',
  AVKLAR_SAMORDNING_GRADERING = '5012',
  AVKLAR_SAMORDNING_UFORE = '5024',
  AVKLAR_SAMORDNING_ANDRE_STATLIGE_YTELSER = '5027',
  AVKLAR_SAMORDNING_ARBEIDSGIVER = '5030',
  VURDER_TREKK_AV_SØKNAD_KODE = '5028',
  YRKESSKADE_KODE = '5013',
  FASTSETT_YRKESSKADEINNTEKT = '5014',
  EFFEKTUER_11_7_KODE = '5015',
  AVKLAR_LOVVALG_MEDLEMSKAP = '5017',
  MANUELL_OVERSTYRING_LOVVALG = '5021',
  FORESLÅ_VEDTAK_KODE = '5098',
  FATTE_VEDTAK_KODE = '5099',
  KVALITETSSIKRING_KODE = '5097',
  SKRIV_BREV_KODE = '5050',
  SKRIV_VEDTAKSBREV_KODE = '5051',
  SKRIV_FORHÅNDSVARSEL_AKTIVITETSPLIKT_BREV_KODE = '5052',
  AVKLAR_FORUTGÅENDE_MEDLEMSKAP = '5020',
  MANUELL_OVERSTYRING_MEDLEMSKAP = '5022',
  REFUSJON_KRAV_KODE = '5026',
  VURDER_RETTIGHETSPERIODE = '5029',
  FASTSETT_PÅKLAGET_BEHANDLING = '5999',
  VURDER_FORMKRAV = '6000',
  FASTSETT_BEHANDLENDE_ENHET = '6001',
  VURDER_KLAGE_KONTOR = '6002',
  VURDER_KLAGE_NAY = '6003',
  SKRIV_FORHÅNDSVARSEL_KLAGE_FORMKRAV_BREV_KODE = '6005',
  KLAGE_OPPSUMMERING = '6006',
  HÅNDTER_SVAR_FRA_ANDREINSTANS = '6008',
  FASTSETT_FULLMEKTIG = '6009',
  TREKK_KLAGE_KODE = '6010',
  SAMORDNING_REFUSJONS_KRAV = '5056',
  FASTSETT_MANUELL_INNTEKT = '7001',
}

type BehovsKode = `${Behovstype}`;

export function mapBehovskodeTilBehovstype(kode: BehovsKode): string {
  switch (kode) {
    case '5001':
      return '§ 11-14 Student';
    case '5003':
      return '§ 11-5 Nedsatt arbeidsevne og krav til årsakssammenheng';
    case '5004':
      return '§ 11-23 andre ledd. Arbeidsevne som ikke er utnyttet';
    case '5005':
      return '§ 11-10 tredje ledd. Unntak fra meldeplikt';
    case '5006':
      return '§ 11-6 Behov for bistand til å skaffe seg eller beholde arbeid';
    case '5007':
      return '§ 11-13 AAP som sykepengeerstatning';
    case '5008':
      return '§ 11-19 Tidspunktet for når arbeidsevnen ble nedsatt, jf. § 11-5';
    case '5009':
      return '§ 11-20 tredje og fjerde ledd barnetillegg';
    case '5098':
      return 'Foreslå vedtak';
    case '5099':
      return 'Fatte vedtak';
    case '5097':
      return 'Kvalitetssikring';
    case '9001':
      return 'Manuelt satt på vent';
    case '5010':
      return '§ 11-26 Soning';
    case '5011':
      return '§ 11-25 Helseinstitusjon';
    case '5012':
      return '§§ 11-27 / 11-28 Samordning med andre folketrygdytelser';
    case '5013':
      return '§ 11-22 AAP ved yrkesskade';
    case '5014':
      return 'Yrkesskade grunnlagsberegning §§ 11-19 / 11-22';
    case '5015':
      return '§ 11-7 Bidrar ikke til egen avklaring / behandling';
    case '5017':
      return 'Lovvalg og medlemskap ved søknadstidspunkt';
    case '5020':
      return '§ 11-2 Forutgående medlemskap';
    case '5021':
      return 'Overstyr lovvalg';
    case '5024':
      return 'Samordning med delvis uføre';
    case '5026':
      return 'Sosialstønad refusjonskrav';
    case '5027':
      return 'Andre ytelser til avregning';
    case '5028':
      return 'Vurder trekk av søknad';
    case '5030':
      return 'Samordning arbeidsgiver';
    case '5022':
      return 'Overstyr § 11-2 forutgående medlemskap';
    case '5050':
      return 'Skriv brev';
    case '5051':
      return 'Skriv brev';
    case '5052':
      return 'Skriv brev';
    case '5029':
      return 'Starttidspunkt';
    case '5999':
      return 'Fastsett påklaget behandling';
    case '6000':
      return 'Formkrav';
    case '6001':
      return 'Fastsett behandlende enhet';
    case '6002':
      return 'Vurder klage';
    case '6003':
      return 'Behandle klage';
    case '6005':
      return 'Skriv forhåndsvarsel klage';
    case '6006':
      return 'Oppsummering av klagebehandlingen';
    case '6008':
      return 'Vurder konsekvens av svar fra Nav Klaginstans';
    case '6009':
      return 'Fastsett fullmektig/verge';
    case '6010':
      return 'Trekk klage';
    case '5056':
      return 'Refusjonskrav tjenestepensjon';
    case '7001':
      return 'Pensjonsgivende inntekt mangler (§ 11-19)';
  }
}

export enum JaEllerNei {
  Ja = 'ja',
  Nei = 'nei',
}

export const JaEllerNeiOptions: ValuePair[] = [
  { label: 'Ja', value: JaEllerNei.Ja },
  { label: 'Nei', value: JaEllerNei.Nei },
];

export const getTrueFalseEllerUndefined = (value?: JaEllerNei): boolean | undefined => {
  if (!value) {
    return undefined;
  }
  return value === JaEllerNei.Ja;
};

export const getJaNeiEllerUndefined = (value?: boolean | null) => {
  if (value === undefined || value === null) {
    return undefined;
  }
  return value ? JaEllerNei.Ja : JaEllerNei.Nei;
};

export const getStringEllerUndefined = (value?: number | string | null) => {
  if (value === undefined || value === null) {
    return undefined;
  }
  return value.toString();
};

export function getJaNeiEllerIkkeBesvart(value?: boolean | null) {
  if (value === undefined || value === null) {
    return 'Ikke besvart';
  }
  return value ? JaEllerNei.Ja : JaEllerNei.Nei;
}
