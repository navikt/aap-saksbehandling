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
