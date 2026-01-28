import { components } from 'lib/types/schema';
import { formaterDatoForFrontend } from 'lib/utils/date';
import { parseISO } from 'date-fns';

type PeriodisertGrunnlag = {
  behøverVurderinger: components['schemas']['no.nav.aap.komponenter.type.Periode'][];
  kanVurderes: components['schemas']['no.nav.aap.komponenter.type.Periode'][];
  nyeVurderinger: Array<unknown>;
  sisteVedtatteVurderinger: Array<unknown>;
};

export function getFraDatoFraGrunnlagForFrontend(grunnlag: PeriodisertGrunnlag | null | undefined): string {
  if (grunnlag == null) {
    return '';
  }

  if (grunnlag.behøverVurderinger.length >= 1) {
    return formaterDatoForFrontend(parseISO(grunnlag.behøverVurderinger[0].fom));
  }

  if (grunnlag.kanVurderes.length >= 1) {
    return formaterDatoForFrontend(parseISO(grunnlag.kanVurderes[0].fom));
  }

  return '';
}

export function trengerTomPeriodisertVurdering(grunnlag: PeriodisertGrunnlag | undefined) {
  // Trenger tom vurdering hvis vi ikke har tidligere vurderinger eller nye vurderinger,
  // eller vi har minst en periode som behøver vurdering
  //
  if (
    !grunnlag ||
    (grunnlag.nyeVurderinger.length === 0 && grunnlag.behøverVurderinger.length > 0) ||
    (grunnlag.nyeVurderinger.length === 0 && grunnlag.sisteVedtatteVurderinger.length === 0)
  ) {
    return true;
  }
  return false;
}
