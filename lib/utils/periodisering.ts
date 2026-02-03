import { components } from 'lib/types/schema';
import { formaterDatoForFrontend } from 'lib/utils/date';
import { parseISO } from 'date-fns';

export type PeriodisertGrunnlag = {
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
  if (!grunnlag) {
    return true;
  }

  const harNye = grunnlag.nyeVurderinger.length > 0;
  const harVedtatte = grunnlag.sisteVedtatteVurderinger.length > 0;
  const harBehov = grunnlag.behøverVurderinger.length > 0;

  return !harNye && !harVedtatte && harBehov;
}
