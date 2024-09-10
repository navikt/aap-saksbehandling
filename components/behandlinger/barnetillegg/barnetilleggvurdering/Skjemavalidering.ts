import { VurderingAvForeldreAnsvar, VurdertBarn } from 'lib/types/types';
import { ManueltBarnVurderingError, Vurderinger } from './BarnetilleggVurdering';

import { formaterDatoForBackend } from 'lib/utils/date';
import { JaEllerNei } from 'lib/utils/form';
import { isBefore, isFuture } from 'date-fns';

interface Valideringsfeil {
  errors: ManueltBarnVurderingError[];
}

interface MappetSkjema {
  mappetSkjema: VurdertBarn[];
}

const validerOgMapSkjema = (vurderinger: Vurderinger) => {
  const errors: ManueltBarnVurderingError[] = [];
  const resultat: VurdertBarn[] = [];
  Object.keys(vurderinger).forEach((ident) => {
    const manueltBarnVurderinger = vurderinger[ident];
    const manuelleVurderinger: VurderingAvForeldreAnsvar[] = [];
    manueltBarnVurderinger.forEach((vurdering) => {
      if (!vurdering.begrunnelse || !vurdering.harForeldreAnsvar || !vurdering.fom) {
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
        }
      } else if (vurdering.fom) {
        if (isFuture(vurdering.fom)) {
          errors.push({
            formId: vurdering.formId,
            felt: 'fom',
            message: 'Dato for når søker har forsørgeransvar fra kan ikke være frem i tid',
          });
        }
        if (vurdering.tom && isBefore(vurdering.tom, vurdering.fom)) {
          errors.push({
            formId: vurdering.formId,
            felt: 'tom',
            message: 'Slutt-dato kan ikke være før start-dato',
          });
        }
      } else {
        manuelleVurderinger.push({
          begrunnelse: vurdering.begrunnelse,
          harForeldreAnsvar: vurdering.harForeldreAnsvar === JaEllerNei.Ja,
          periode: {
            fom: formaterDatoForBackend(vurdering.fom),
            tom: formaterDatoForBackend(vurdering.tom ?? new Date()),
          },
        });
      }

      resultat.push({
        ident: {
          identifikator: ident,
          aktivIdent: true,
        },
        vurderinger: manuelleVurderinger,
      });
    });
  });

  return { errors, resultat };
};

export const prosseserSkjema = (vurderinger: Vurderinger): Valideringsfeil | MappetSkjema => {
  const { errors, resultat } = validerOgMapSkjema(vurderinger);
  if (errors.length > 0) {
    return { errors: errors };
  }
  return {
    mappetSkjema: resultat,
  };
};
