import { BehandlingFlytOgTilstand, StegGruppe, StegType } from 'lib/types/types';

// TODO: Bedre filtrering etterhvert som vi får steg med flere enn ett avklaringsbehov
export const getStegSomSkalVises = (gruppe: StegGruppe, flyt: BehandlingFlytOgTilstand): Array<StegType> => {
  const grupper = flyt.flyt.find((flyt2) => flyt2.stegGruppe === gruppe);
  return (
    grupper?.steg
      .filter((steg) => steg.avklaringsbehov.length > 0)
      .filter((steg) => steg.avklaringsbehov.every((avklaringsbehov) => avklaringsbehov.status !== 'AVBRUTT'))
      .map((steg) => steg.stegType) ?? []
  );
};

export interface DetaljertSteg {
  navn: string;
  paragraf: string;
}

export const mapStegTypeTilDetaljertSteg = (stegType: StegType): DetaljertSteg => {
  switch (stegType) {
    case 'AVKLAR_STUDENT':
      return {
        navn: 'Student',
        paragraf: '11-14',
      };
    case 'AVKLAR_YRKESSKADE':
      return {
        navn: 'Yrkesskade',
        paragraf: '11-22',
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
    case 'VURDER_SYKEPENGEERSTATNING': {
      return {
        navn: 'Sykepengeerstatning',
        paragraf: '11-13',
      };
    }
    default:
      return {
        navn: stegType,
        paragraf: '',
      };
  }
};

export const mapStegTypeTilStegNavn = (stegType: StegType): string => {
  switch (stegType) {
    case 'AVKLAR_STUDENT':
      return 'Student';
    case 'AVKLAR_YRKESSKADE':
      return 'Yrkesskade';
    case 'AVKLAR_SYKDOM':
      return 'Nedsatt arbeidsevne';
    case 'VURDER_BISTANDSBEHOV':
      return 'Behov for oppfølging';
    case 'FRITAK_MELDEPLIKT':
      return 'Unntak fra meldeplikt';
    case 'FATTE_VEDTAK':
      return 'Fatte vedtak';
    case 'VURDER_SYKEPENGEERSTATNING':
      return 'Sykepengeerstatning';
    case 'VURDER_ALDER':
      return 'Alder';
    default:
      return stegType;
  }
};
export const getHeaderForSteg = (detaljertSteg: DetaljertSteg): string =>
  `${detaljertSteg.navn} - § ${detaljertSteg.paragraf}`;
