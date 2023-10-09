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
