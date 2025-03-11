import { SykdomsGrunnlag, TypeBehandling } from 'lib/types/types';

export function finnDiagnosegrunnlag(typeBehandling: TypeBehandling, grunnlag: SykdomsGrunnlag) {
  if (typeBehandling === 'Revurdering' && !grunnlag.sykdomsvurderinger.at(-1)?.kodeverk) {
    return grunnlag.gjeldendeVedtatteSykdomsvurderinger.at(-1);
  }
  return grunnlag.sykdomsvurderinger.at(-1);
}
