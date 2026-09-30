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
    {
      lenkeTekst: 'Kunnskapsbank trygdemedisin (Navet)',
      url: 'https://navno.sharepoint.com/sites/fag-og-ytelser-Kunnskapsbank-trygdemedisin?xsdata=MDV8MDJ8fGJiOWUzNjg2NDY0ODQ3YzU3ODU3MDhkZTY4N2Y1ZjQzfDYyMzY2NTM0MWVjMzQ5NjI4ODY5OWI1NTM1Mjc5ZDBifDB8MHw2MzkwNjMwOTM0MDE1ODE2NTV8VW5rbm93bnxWR1ZoYlhOVFpXTjFjbWwwZVZObGNuWnBZMlY4ZXlKRFFTSTZJbFJsWVcxelgwRlVVRk5sY25acFkyVmZVMUJQVEU5R0lpd2lWaUk2SWpBdU1DNHdNREF3SWl3aVVDSTZJbGRwYmpNeUlpd2lRVTRpT2lKUGRHaGxjaUlzSWxkVUlqb3hNWDA9fDF8TDJOb1lYUnpMekU1T20xbFpYUnBibWRmV2tSVmQxbDZUWGxOUkVGMFRXcFZNRmw1TURCTmFteHRURlJuZWs5WFVYUk9SMUV5V2xSa2ExbFhWVFZPZWtwcVFIUm9jbVZoWkM1Mk1pOXRaWE56WVdkbGN5OHhOemN3TnpFeU5UTTNPRFUzfDcwMzFmYjg0NmMzMjQ2NTRiZTEyMDhkZTY4N2Y1ZjQyfDI4YjYwODg2NWNjMTQwOTlhYTg2YzczN2EwNDk2Zjc2&sdata=MWJMTWlzTmVudFVzRXhCZkJJdGFEbWJ0QnZQQnh4djlTdWgxUHF1OHp2TT0%3D',
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
  SYKDOMSVURDERING_BREV: [
    {
      lenkeTekst: 'Metode for vurdering §§ 11-5 og 11-6 (Navet)',
      url: 'https://navno.sharepoint.com/sites/fag-og-ytelser-arbeid-arbeidsavklaringspenger/SitePages/Metode-for-vilk%C3%A5rsvurdering-%C2%A7-11-5.aspx',
    },
  ],
};
