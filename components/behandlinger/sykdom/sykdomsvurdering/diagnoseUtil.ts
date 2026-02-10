import { SykdomsGrunnlag, TypeBehandling } from 'lib/types/types';

/**
 * Feltene sykdomsvurderinger og gjeldendeVedtatteSykdomsvurderinger er deprecated.
 */
export function finnDiagnosegrunnlag(typeBehandling: TypeBehandling, grunnlag: SykdomsGrunnlag) {
  if (typeBehandling === 'Revurdering' && !grunnlag.sykdomsvurderinger.at(-1)?.kodeverk) {
    return grunnlag.gjeldendeVedtatteSykdomsvurderinger.at(-1);
  }
  return grunnlag.sykdomsvurderinger.at(-1);
}

export function finnDiagnosegrunnlagPeriodisert(typeBehandling: TypeBehandling, grunnlag: SykdomsGrunnlag) {
  if (typeBehandling === 'Revurdering' && !grunnlag.nyeVurderinger.at(-1)?.kodeverk) {
    return grunnlag.sisteVedtatteVurderinger.at(-1);
  }
  return grunnlag.nyeVurderinger.at(-1);
}
