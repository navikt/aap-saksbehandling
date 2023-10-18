import { BehandlingFlytOgTilstand2, StegGruppe, StegType } from 'lib/types/types';

// TODO: Bedre filtrering etterhvert som vi får steg med flere enn ett avklaringsbehov
export const getStegSomSkalVises = (gruppe: StegGruppe, flyt: BehandlingFlytOgTilstand2): Array<StegType> => {
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
    default:
      return {
        navn: stegType,
        paragraf: '',
      };
  }
};

export const getHeaderForSteg = (detaljertSteg: DetaljertSteg): string =>
  `${detaljertSteg.navn} - § ${detaljertSteg.paragraf}`;
