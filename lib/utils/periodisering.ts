import { components } from 'lib/types/schema';
import { formaterDatoForFrontend } from 'lib/utils/date';
import { parseISO } from 'date-fns';
import { Dato } from 'lib/types/Dato';

export type PeriodisertGrunnlag = {
  behøverVurderinger: components['schemas']['no.nav.aap.komponenter.type.Periode'][];
  kanVurderes: components['schemas']['no.nav.aap.komponenter.type.Periode'][];
  nyeVurderinger: Array<object>;
  sisteVedtatteVurderinger: Array<object>;
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

export function trengerVurderingsForslag(grunnlag: PeriodisertGrunnlag | undefined) {
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

  const harNyeVurderinger = grunnlag.nyeVurderinger.length > 0;
  const behøverVurderinger = grunnlag.behøverVurderinger.length > 0;
  const harVedtatteVurderinger = grunnlag.sisteVedtatteVurderinger.length > 0;

  if (harNyeVurderinger) {
    return false;
  }

  return behøverVurderinger || !harVedtatteVurderinger;
}

export function hentPerioderSomTrengerVurdering<T>(
  grunnlag: PeriodisertGrunnlag,
  tomVurdering: () => T
): { vurderinger: Array<T> } {
  // Hvis det finnes perioder i grunnlag.behøverVurderinger brukes disse som utgangspunkt, hvis ikke
  // lager vi en tom vurdering med fraDato fra grunnlag.kanVurderes
  const initiellePerioder =
    grunnlag.behøverVurderinger.length > 0
      ? grunnlag.behøverVurderinger.map((periode) => ({
          fraDato: new Dato(periode.fom).formaterForFrontend(),
          behøverVurdering: true,
        }))
      : [{ fraDato: getFraDatoFraGrunnlagForFrontend(grunnlag), behøverVurdering: null }];

  return {
    vurderinger: initiellePerioder.map((periode) => ({
      ...tomVurdering(),
      ...periode,
    })),
  };
}
