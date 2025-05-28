import { BehandlingFlytOgTilstand, StegGruppe, StegType } from 'lib/types/types';

export const getStegSomSkalVises = (
  aktivStegGruppe: StegGruppe,
  behandlingFlytOgTilstand: BehandlingFlytOgTilstand
): Array<StegType> => {
  const stegGruppe = behandlingFlytOgTilstand.flyt.find((gruppe) => gruppe.stegGruppe === aktivStegGruppe);

  return (
    stegGruppe?.steg
      .filter((steg) => steg.avklaringsbehov && steg.avklaringsbehov.length > 0)
      .filter((steg) => steg.avklaringsbehov.every((avklaringsbehov) => avklaringsbehov.status !== 'AVBRUTT'))
      .map((steg) => steg.stegType) ?? []
  );
};
