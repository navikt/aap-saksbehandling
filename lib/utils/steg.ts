import { Avklaringsbehov, BehandlingFlytOgTilstand, StegGruppe, StegType, TypeBehandling } from 'lib/types/types';

export const getStegSomSkalVises = (
  aktivStegGruppe: StegGruppe,
  behandlingFlytOgTilstand: BehandlingFlytOgTilstand
): Array<StegType> => {
  const stegGruppe = behandlingFlytOgTilstand.flyt.find((gruppe) => gruppe.stegGruppe === aktivStegGruppe);

  return (
    stegGruppe?.steg
      .filter((steg) => steg.avklaringsbehov && steg.avklaringsbehov.length > 0)
      .filter((steg) => steg.avklaringsbehov.some((avklaringsbehov) => avklaringsbehov.status !== 'AVBRUTT'))
      .map((steg) => steg.stegType) ?? []
  );
};

const getAvklaringsbehovForSteg = (
  aktivStegGruppe: StegGruppe,
  stegType: StegType,
  behandlingFlytOgTilstand: BehandlingFlytOgTilstand
): Avklaringsbehov[] => {
  const stegGruppe = behandlingFlytOgTilstand.flyt.find((gruppe) => gruppe.stegGruppe === aktivStegGruppe);

  return (
    stegGruppe?.steg
      .filter((steg) => steg.avklaringsbehov && steg.avklaringsbehov.length > 0)
      .filter((steg) => steg.avklaringsbehov.some((avklaringsbehov) => avklaringsbehov.status !== 'AVBRUTT'))
      .filter((steg) => steg.stegType == stegType)
      .flatMap((steg) => steg.avklaringsbehov) ?? []
  );
};

export const getStegData = (
  stegGruppe: StegGruppe,
  stegType: StegType,
  behandlingFlytOgTilstand: BehandlingFlytOgTilstand
): StegData => {
  const avklaringsbehov = getAvklaringsbehovForSteg(stegGruppe, stegType, behandlingFlytOgTilstand);
  const harAvklaringsbehov = avklaringsbehov.length > 0;

  return {
    behandlingVersjon: behandlingFlytOgTilstand.behandlingVersjon,
    typeBehandling: behandlingFlytOgTilstand.visning.typeBehandling,
    avklaringsbehov: avklaringsbehov,
    skalViseSteg: harAvklaringsbehov || behandlingFlytOgTilstand.visning.typeBehandling === 'Revurdering',
    readOnly: behandlingFlytOgTilstand.visning.saksbehandlerReadOnly || !harAvklaringsbehov,
  };
};

export const skalViseSteg = (stegData: StegData, harTidligereVurdering: boolean) => {
  return stegData.avklaringsbehov.length > 0 || (stegData.typeBehandling === 'Revurdering' && harTidligereVurdering);
};

export interface StegData {
  behandlingVersjon: number;
  typeBehandling: TypeBehandling;
  avklaringsbehov: Array<Avklaringsbehov>;
  skalViseSteg: boolean;
  readOnly: boolean;
}
