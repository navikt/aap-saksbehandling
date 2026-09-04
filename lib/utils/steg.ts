import { Avklaringsbehov, BehandlingFlytOgTilstand, StegGruppe, StegType, TypeBehandling } from 'lib/types/types';
import { Behovstype } from 'lib/utils/form';
import { PeriodisertGrunnlag } from 'lib/utils/periodisering';

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

export const getAvklaringsbehovForSteg = (
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
    stegType: stegType,
    behandlingVersjon: behandlingFlytOgTilstand.behandlingVersjon,
    typeBehandling: typeBehandling,
    avklaringsbehov: avklaringsbehov,
    readOnly: readOnly,
    erIkkePåVent: !behandlingFlytOgTilstand.visning.visVentekort,
  };
};

/**
 * Skal vise vilkårskort dersom vi har et avklaringsbehov, eller dersom vi har fått en vurdering. For periodiserte
 * grunnlag vil det si at det enten finnes vedtatte vurderinger, nye vurderinger, eller begge deler.
 */
export const skalViseStegForPeriodisertGrunnlag = (
  avklaringsbehov: Array<Avklaringsbehov>,
  grunnlag: PeriodisertGrunnlag
) => {
  return skalViseStegIkkePeriodisertGrunnlag(
    avklaringsbehov,
    grunnlag.sisteVedtatteVurderinger.length > 0 || grunnlag.nyeVurderinger.length > 0
  );
};

/**
 * Skal vise vilkårskort dersom vi har et avklaringsbehov eller dersom vi har fått en vurdering.
 */
export const skalViseStegIkkePeriodisertGrunnlag = (avklaringsbehov: Array<Avklaringsbehov>, harVurdering: boolean) => {
  return avklaringsbehov.length > 0 || harVurdering;
};

export interface StegData {
  stegType: StegType;
  behandlingVersjon: number;
  typeBehandling: TypeBehandling;
  avklaringsbehov: Array<Avklaringsbehov>;
  readOnly: boolean;
  erIkkePåVent: boolean;
}
