import { VurderingAvForeldreAnsvar, VurdertBarn } from 'lib/types/types';
import { ManueltBarnVurderingError, Vurderinger } from './BarnetilleggVurdering';

import { formaterDatoForBackend } from 'lib/utils/date';
import { JaEllerNei } from 'lib/utils/form';
import { isFuture } from 'date-fns';

interface Valideringsfeil {
  errors: ManueltBarnVurderingError[];
}

interface MappetSkjema {
  mappetSkjema: VurdertBarn[];
}

const validerSkjema = (vurderinger: Vurderinger): ManueltBarnVurderingError[] | undefined => {
  const errors: ManueltBarnVurderingError[] = [];
  Object.keys(vurderinger).forEach((ident) => {
    const manueltBarnVurderinger = vurderinger[ident];
    manueltBarnVurderinger.forEach((vurdering) => {
      if (!vurdering.begrunnelse) {
        errors.push({ formId: vurdering.formId, felt: 'begrunnelse', message: 'Du må gi en begrunnelse' });
      }
      if (!vurdering.harForeldreAnsvar) {
        errors.push({
          formId: vurdering.formId,
          felt: 'harForeldreAnsvar',
          message: 'Du må besvare om det skal beregnes barnetillegg for barnet',
        });
      }
      if (!vurdering.fom) {
        errors.push({
          formId: vurdering.formId,
          felt: 'fom',
          message: 'Du må sette en dato for når søker har forsørgeransvar for barnet fra',
        });
      } else {
        if (isFuture(vurdering.fom)) {
          errors.push({
            formId: vurdering.formId,
            felt: 'fom',
            message: 'Dato for når søker har forsørgeransvar fra kan ikke være frem i tid',
          });
        }
      }
    });
  });
  return errors.length > 0 ? errors : undefined;
};

const mapSkjema = (vurderinger: Vurderinger): VurdertBarn[] => {
  const resultat: VurdertBarn[] = [];
  Object.keys(vurderinger).forEach((ident) => {
    const manuelleVurderinger: VurderingAvForeldreAnsvar[] = [];
    const manueltBarnVurderinger = vurderinger[ident];
    manueltBarnVurderinger.forEach((vurdering) => {
      manuelleVurderinger.push({
        begrunnelse: vurdering.begrunnelse ?? '',
        harForeldreAnsvar: vurdering.harForeldreAnsvar === JaEllerNei.Ja,
        periode: {
          fom: formaterDatoForBackend(vurdering.fom ?? new Date()),
          tom: formaterDatoForBackend(vurdering.tom ?? new Date()),
        },
      });
    });
    resultat.push({
      ident: {
        identifikator: ident,
        aktivIdent: true,
      },
      vurderinger: manuelleVurderinger,
    });
  });
  return resultat;
};

export const prosseserSkjema = (vurderinger: Vurderinger): Valideringsfeil | MappetSkjema => {
  const errors = validerSkjema(vurderinger);
  if (errors) {
    return { errors: errors };
  }
  return {
    mappetSkjema: mapSkjema(vurderinger),
  };
};
