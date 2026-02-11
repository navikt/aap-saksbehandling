import { SykdomsGrunnlag, TypeBehandling } from 'lib/types/types';

export function finnDiagnosegrunnlag(typeBehandling: TypeBehandling, grunnlag: SykdomsGrunnlag) {
  if (typeBehandling === 'Revurdering' && !grunnlag.nyeVurderinger.at(-1)?.kodeverk) {
    return grunnlag.sisteVedtatteVurderinger.at(-1);
  }
  return grunnlag.nyeVurderinger.at(-1);
}
