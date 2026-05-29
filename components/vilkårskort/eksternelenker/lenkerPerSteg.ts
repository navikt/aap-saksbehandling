import { StegType } from 'lib/types/types';

interface EksternLenkeIVilkårskort {
  lenkeTekst: string;
  url: string;
}

export const lenkerPerSteg: Partial<Record<StegType, EksternLenkeIVilkårskort[]>> = {
  AVKLAR_SYKDOM: [
    {
      lenkeTekst: 'Rundskriv § 11-5 (lovdata.no)',
      url: 'https://lovdata.no/nav/rundskriv/r11-00#KAPITTEL_7-1',
    },
    {
      lenkeTekst: 'Rutiner: Sykdom (Navet)',
      url: 'https://navno.sharepoint.com/sites/fag-og-ytelser-arbeid-arbeidsavklaringspenger/SitePages/Rutiner-for-Kelvin---Sykdom.aspx',
    },
    {
      lenkeTekst: 'Metode for vurdering §§ 11-5 og 11-6 (Navet) ',
      url: 'https://navno.sharepoint.com/sites/fag-og-ytelser-arbeid-arbeidsavklaringspenger/SitePages/Metode-for-vilk%C3%A5rsvurdering-%C2%A7-11-5.aspx',
    },
  ],
  VURDER_BISTANDSBEHOV: [
    {
      lenkeTekst: 'Rundskriv § 11-6 (lovdata.no)',
      url: 'https://lovdata.no/nav/rundskriv/r11-00#KAPITTEL_8',
    },
    {
      lenkeTekst: 'Rutiner: Sykdom (Navet)',
      url: 'https://navno.sharepoint.com/sites/fag-og-ytelser-arbeid-arbeidsavklaringspenger/SitePages/Rutiner-for-Kelvin---Sykdom.aspx',
    },
    {
      lenkeTekst: 'Metode for vurdering §§ 11-5 og 11-6 (Navet)',
      url: 'https://navno.sharepoint.com/sites/fag-og-ytelser-arbeid-arbeidsavklaringspenger/SitePages/Metode-for-vilk%C3%A5rsvurdering-%C2%A7-11-5.aspx',
    },
  ],
  FRITAK_MELDEPLIKT: [
    {
      lenkeTekst: 'Rundskriv § 11-10 tredje ledd (lovdata.no)',
      url: 'https://lovdata.no/nav/rundskriv/r11-00#KAPITTEL_12-4',
    },
    {
      lenkeTekst: 'Rutiner: Sykdom (Navet)',
      url: 'https://navno.sharepoint.com/sites/fag-og-ytelser-arbeid-arbeidsavklaringspenger/SitePages/Rutiner-for-Kelvin---Sykdom.aspx',
    },
  ],
  ETABLERING_EGEN_VIRKSOMHET: [
    {
      lenkeTekst: 'Rundskriv § 11-15 (lovdata.no)',
      url: 'https://lovdata.no/nav/rundskriv/r11-00#KAPITTEL_18',
    },
    {
      lenkeTekst: 'Rutiner § 11-15 (Navet)',
      url: 'https://navno.sharepoint.com/sites/fag-og-ytelser-arbeid-arbeidsavklaringspenger/SitePages/Rutine-for-Kelvin--Egenetablering.aspx',
    },
  ],
  FASTSETT_ARBEIDSEVNE: [
    {
      lenkeTekst: 'Rundskriv § 11-23 andre ledd (lovdata.no)',
      url: 'https://lovdata.no/nav/rundskriv/r11-00#KAPITTEL_26-3',
    },
    {
      lenkeTekst: 'Rutiner: Sykdom (Navet)',
      url: 'https://navno.sharepoint.com/sites/fag-og-ytelser-arbeid-arbeidsavklaringspenger/SitePages/Rutiner-for-Kelvin---Sykdom.aspx',
    },
  ],
  ARBEIDSOPPTRAPPING: [
    {
      lenkeTekst: 'Rundskriv § 11-23 sjette ledd (lovdata.no) ',
      url: 'https://lovdata.no/nav/rundskriv/r11-00#KAPITTEL_26-7',
    },
    {
      lenkeTekst: 'Rutiner: Sykdom (Navet)',
      url: 'https://navno.sharepoint.com/sites/fag-og-ytelser-arbeid-arbeidsavklaringspenger/SitePages/Rutiner-for-Kelvin---Sykdom.aspx',
    },
  ],
  OVERGANG_UFORE: [
    {
      lenkeTekst: 'Rundskriv § 11-18 (lovdata.no)',
      url: 'https://lovdata.no/nav/rundskriv/r11-00#ref/lov/1997-02-28-19/%C2%A711-18',
    },
    {
      lenkeTekst: 'Rutiner § 11-18 (Navet)',
      url: 'https://navno.sharepoint.com/sites/fag-og-ytelser-arbeid-arbeidsavklaringspenger/SitePages/Vurdering-for-uf%C3%B8retrygd.aspx',
    },
  ],
  OVERGANG_ARBEID: [
    {
      lenkeTekst: 'Rundskriv § 11-17 (lovdata.no)',
      url: 'https://lovdata.no/nav/rundskriv/r11-00#KAPITTEL_20',
    },
    {
      lenkeTekst: 'Rutiner § 11-17 (Navet)',
      url: 'https://navno.sharepoint.com/sites/fag-og-ytelser-arbeid-arbeidsavklaringspenger/SitePages/%C2%A7-11-17-arbeidsavklaringspenger-mens-brukeren-s%C3%B8ker-arbeid.aspx',
    },
  ],
};
