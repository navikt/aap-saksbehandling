import { StønadsperiodeGrunnlag, StønadsperiodeVurdering, StønadsperiodeVurderingLøsning } from 'lib/types/types';
import { formaterDatoForFrontend } from 'lib/utils/date';
import { getJaNeiEllerUndefined, JaEllerNei } from 'lib/utils/form';

export interface StønadsperiodeKravFormFields {
  begrunnelse: string;
  harHattOrdinærSiste52Uker?: string;
  harGjenværendeKvote?: string;
  datoKravetSkalVurderesFra: string;
  stansOpphørType?: NonNullable<StønadsperiodeVurderingLøsning['stansOpphør']>['type'];
  stansÅrsaker?: NonNullable<StønadsperiodeVurderingLøsning['stansOpphør']>['årsaker'];
}

export interface StønadsperiodeFormFields {
  valgteKrav: string[];
  vurderinger: Record<string, StønadsperiodeKravFormFields>;
}

export function finnStønadsperiodeVurderingFraReferanse(
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
  const vurdering = finnStønadsperiodeVurderingFraReferanse(grunnlag, referanse);
  return vurdering ? stønadsperiodeVurderingTilFormFields(vurdering) : undefined;
}

export function stønadsperiodeVurderingTilFormFields(vurdering: StønadsperiodeVurdering): StønadsperiodeKravFormFields {
  return {
    begrunnelse: vurdering?.begrunnelse || '',
    harHattOrdinærSiste52Uker: getJaNeiEllerUndefined(vurdering.harHattOrdinærSiste52Uker),
    harGjenværendeKvote: getJaNeiEllerUndefined(vurdering.harGjenværendeKvote),
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

export function byggVurderingerFraSKjema(
  grunnlag: StønadsperiodeGrunnlag,
  vurderinger: Record<string, StønadsperiodeKravFormFields>
): StønadsperiodeVurderingLøsning[] {
  const endredeVurderinger = Object.entries(vurderinger).flatMap(([referanse, felter]) => {
    const originalVurdering = finnStønadsperiodeVurderingFraReferanse(grunnlag, referanse);
    if (!originalVurdering) return [];

    const originalFelter = stønadsperiodeVurderingTilFormFields(originalVurdering);
    return erFelterEndret(originalFelter, felter) ? [{ originalVurdering, felter }] : [];
  });

  return endredeVurderinger.map(({ originalVurdering, felter }) => feltTilLøsning(felter, originalVurdering));
}

function feltTilLøsning(
  felter: StønadsperiodeKravFormFields,
  originalVurdering: StønadsperiodeVurdering
): StønadsperiodeVurderingLøsning {
  return {
    relevantKravType: originalVurdering.relevantKravType,
    referanse: { verdi: originalVurdering.referanse },
    begrunnelse: felter.begrunnelse,
    harGjenværendeKvote: felter.harGjenværendeKvote === JaEllerNei.Ja,
    harHattOrdinærSiste52Uker: felter.harHattOrdinærSiste52Uker === JaEllerNei.Ja,
    startDato: felter.datoKravetSkalVurderesFra,
    ...(felter.stansOpphørType && {
      stansOpphør: {
        type: felter.stansOpphørType,
        årsaker: felter.stansOpphørType === 'STANS' ? (felter.stansÅrsaker ?? []) : [],
      },
    }),
  };
}

function erFelterEndret(original: StønadsperiodeKravFormFields, gjeldende: StønadsperiodeKravFormFields): boolean {
  return (
    original.begrunnelse !== gjeldende.begrunnelse ||
    original.harHattOrdinærSiste52Uker !== gjeldende.harHattOrdinærSiste52Uker ||
    original.datoKravetSkalVurderesFra !== gjeldende.datoKravetSkalVurderesFra ||
    original.harGjenværendeKvote !== gjeldende.harGjenværendeKvote ||
    original.stansOpphørType !== gjeldende.stansOpphørType ||
    erArraysForskjellige(original.stansÅrsaker, gjeldende.stansÅrsaker)
  );
}

function erArraysForskjellige(original: string[] | undefined, gjeldende: string[] | undefined): boolean {
  const originaleÅrsaker = original ?? [];
  const gjeldendeÅrsaker = gjeldende ?? [];

  return (
    originaleÅrsaker.length !== gjeldendeÅrsaker.length ||
    originaleÅrsaker.some((årsak) => !gjeldendeÅrsaker.includes(årsak))
  );
}