import { randomUUID } from 'crypto';
import { MedIDNyeVurderinger } from 'lib/types/types';

export function leggTilIdPåGrunnlagNyeVurderinger<T extends { nyeVurderinger: any[] }>(
  grunnlag: T
): MedIDNyeVurderinger<T> {
  const nyeVurderinger = (grunnlag?.nyeVurderinger || []).map((e) => ({
    ...e,
    id: randomUUID(),
  }));
  return {
    ...grunnlag,
    nyeVurderinger,
  };
}

export function finnVurdertAvIGrunnlag<T extends { nyeVurderinger: any[] }>(
  vurderingId: string | undefined,
  grunnlag: MedIDNyeVurderinger<T> | undefined
) {
  return grunnlag?.nyeVurderinger.find((e) => e.id === vurderingId)?.vurdertAv;
}
