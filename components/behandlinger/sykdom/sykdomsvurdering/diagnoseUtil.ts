import { TypeBehandling } from 'components/behandlinger/sykdom/sykdomsvurdering/SykdomsvurderingMedDataFetching';
import { SykdomsGrunnlag } from 'lib/types/types';

export function finnDiagnosegrunnlag(typeBehandling: TypeBehandling, grunnlag: SykdomsGrunnlag) {
  if (typeBehandling === 'Revurdering' && !grunnlag.sykdomsvurderinger.at(0)?.kodeverk) {
    return grunnlag.gjeldendeVedtatteSykdomsvurderinger.at(0);
  }
  return grunnlag.sykdomsvurderinger.at(0);
}
