import { BehandlingFlytOgTilstand, StegGruppe, StegType } from 'lib/types/types';

export const getStegSomSkalVises = (gruppe: StegGruppe, flyt: BehandlingFlytOgTilstand): Array<StegType> => {
  const grupper = flyt.flyt.find((flyt2) => flyt2.stegGruppe === gruppe);
  return (
    grupper?.steg
      .filter((steg) => steg.avklaringsbehov && steg.avklaringsbehov.length > 0)
      .filter((steg) => steg.avklaringsbehov.every((avklaringsbehov) => avklaringsbehov.status !== 'AVBRUTT'))
      .map((steg) => steg.stegType) ?? []
  );
};

interface DetaljertSteg {
  navn: string;
  paragraf?: string;
}

export const mapStegTypeTilDetaljertSteg = (stegType: StegType): DetaljertSteg => {
  switch (stegType) {
    case 'AVKLAR_STUDENT':
      return {
        navn: 'Student',
        paragraf: '11-14',
      };
    case 'AVKLAR_SYKDOM':
      return {
        navn: 'Nedsatt arbeidsevne',
        paragraf: '11-5',
      };
    case 'VURDER_BISTANDSBEHOV':
      return {
        navn: 'Behov for oppfølging',
        paragraf: '11-6',
      };
    case 'FRITAK_MELDEPLIKT':
      return {
        navn: 'Unntak fra meldeplikt',
        paragraf: '11-10',
      };
    case 'REFUSJON_KRAV':
      return {
        navn: 'Refusjonskrav',
      };
    case 'VURDER_SYKEPENGEERSTATNING': {
      return {
        navn: 'Sykepengeerstatning',
        paragraf: '11-13',
      };
    }
    case 'BARNETILLEGG': {
      return {
        navn: 'Barnetillegg',
        paragraf: '11-20',
      };
    }
    case 'FASTSETT_ARBEIDSEVNE': {
      return {
        navn: 'Fastsett arbeidsevne',
        paragraf: '11-23',
      };
    }
    case 'FASTSETT_BEREGNINGSTIDSPUNKT': {
      return {
        navn: 'Fastsett beregningstidspunkt',
        paragraf: '11-19',
      };
    }
    case 'FORESLÅ_VEDTAK': {
      return { navn: 'Foreslå vedtak' };
    }
    case 'FATTE_VEDTAK': {
      return { navn: 'Fatte vedtak' };
    }
    default:
      return {
        navn: stegType,
        paragraf: '',
      };
  }
};

export const getHeaderForSteg = (detaljertSteg: DetaljertSteg): string =>
  `${detaljertSteg.navn} - § ${detaljertSteg.paragraf}`;
