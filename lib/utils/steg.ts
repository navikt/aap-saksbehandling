import { Avklaringsbehov, BehandlingFlytOgTilstand, StegGruppe, StegType, TypeBehandling } from 'lib/types/types';
import { Behovstype } from 'lib/utils/form';

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
  behandlingFlytOgTilstand: BehandlingFlytOgTilstand,
  behovstype?: Behovstype
): Avklaringsbehov[] => {
  const stegGruppe = behandlingFlytOgTilstand.flyt.find((gruppe) => gruppe.stegGruppe === aktivStegGruppe);

  return (
    stegGruppe?.steg
      .filter((steg) => steg.avklaringsbehov && steg.avklaringsbehov.length > 0)
      .filter((steg) =>
        steg.avklaringsbehov.some(
          (avklaringsbehov) =>
            avklaringsbehov.status !== 'AVBRUTT' && (!behovstype || avklaringsbehov.definisjon.kode === behovstype)
        )
      )
      .filter((steg) => steg.stegType == stegType)
      .flatMap((steg) => steg.avklaringsbehov) ?? []
  );
};

export const getStegDataForBehovstype = (
  stegGruppe: StegGruppe,
  stegType: StegType,
  behovstype: Behovstype,
  behandlingFlytOgTilstand: BehandlingFlytOgTilstand
): StegData => {
  return getStegData(stegGruppe, stegType, behandlingFlytOgTilstand, behovstype);
};

export const getStegData = (
  stegGruppe: StegGruppe,
  stegType: StegType,
  behandlingFlytOgTilstand: BehandlingFlytOgTilstand,
  behovstype?: Behovstype
): StegData => {
  const avklaringsbehov = getAvklaringsbehovForSteg(stegGruppe, stegType, behandlingFlytOgTilstand, behovstype);
  const harAvklaringsbehov = avklaringsbehov.length > 0;
  const typeBehandling = behandlingFlytOgTilstand.visning.typeBehandling;
  const readOnly =
    behandlingFlytOgTilstand.visning.saksbehandlerReadOnly || (typeBehandling === 'Revurdering' && !harAvklaringsbehov);

  return {
    behandlingVersjon: behandlingFlytOgTilstand.behandlingVersjon,
    typeBehandling: typeBehandling,
    avklaringsbehov: avklaringsbehov,
    skalViseSteg: harAvklaringsbehov || behandlingFlytOgTilstand.visning.typeBehandling === 'Revurdering',
    readOnly: readOnly,
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
