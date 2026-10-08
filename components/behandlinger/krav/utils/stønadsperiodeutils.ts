import { StønadsperiodeGrunnlag, StønadsperiodeVurdering } from 'lib/types/types';
import { formaterDatoForFrontend } from 'lib/utils/date';
import { getJaEllerNei } from 'lib/utils/form';

export interface StønadsperiodeKravFormFields {
  begrunnelse: string;
  brukerenHarHattOrdinærAAPInnen52Uker?: string;
  harGjenværendeKvote?: string;
  datoKravetSkalVurderesFra: string;
}

export interface StønadsperiodeFormFields {
  valgteKrav: string[];
  vurderinger: Record<string, StønadsperiodeKravFormFields>;
}

export function finnStønadsperiodeVurderingByReferanse(
  grunnlag: StønadsperiodeGrunnlag,
  referanse: string
): StønadsperiodeVurdering | undefined {
  return (
    grunnlag.nyeVurderinger.find((vurdering) => vurdering.referanse === referanse) ??
    grunnlag.vedtatteVurderinger.find((vurdering) => vurdering.referanse === referanse)
  );
}

export function hentOriginaleStønadsperiodeFormFelter(
  grunnlag: StønadsperiodeGrunnlag,
  referanse: string
): StønadsperiodeKravFormFields | undefined {
  const vurdering = finnStønadsperiodeVurderingByReferanse(grunnlag, referanse);
  return vurdering ? stønadsperiodeVurderingTilFormFields(vurdering) : undefined;
}

export function stønadsperiodeVurderingTilFormFields(vurdering: StønadsperiodeVurdering): StønadsperiodeKravFormFields {
  return {
    begrunnelse: vurdering?.begrunnelse || '',
    brukerenHarHattOrdinærAAPInnen52Uker: vurdering.harHattOrdinærSiste52Uker
      ? getJaEllerNei(vurdering.harHattOrdinærSiste52Uker)
      : undefined,
    harGjenværendeKvote: vurdering.harGjenværendeKvote ? getJaEllerNei(vurdering.harGjenværendeKvote) : undefined,
    datoKravetSkalVurderesFra: vurdering.startDato ? formaterDatoForFrontend(vurdering.startDato) : '',
  };
}

export function byggInitielleStønadsperiodeVurderinger(
  grunnlag: StønadsperiodeGrunnlag
): StønadsperiodeFormFields['vurderinger'] {
  const vurderinger = [...grunnlag.nyeVurderinger, ...grunnlag.vedtatteVurderinger];
  const unikeVurderinger = vurderinger.filter(
    (vurdering, index) => vurderinger.findIndex((annen) => annen.referanse === vurdering.referanse) === index
  );

  return Object.fromEntries(
    unikeVurderinger.map((vurdering) => [vurdering.referanse, stønadsperiodeVurderingTilFormFields(vurdering)])
  );
}
