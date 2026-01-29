import { formaterDatoForBackend, formaterDatoForFrontend } from 'lib/utils/date';
import { JaEllerNei } from 'lib/utils/form';
import { parse } from 'date-fns';
import { OvergangArbeidGrunnlag, OvergangArbeidLøsning } from 'lib/types/types';
import {
  OvergangArbeidForm,
  OvergangArbeidVurderingForm,
} from 'components/behandlinger/sykdom/overgangarbeid/OvergangArbeid-types';
import { getFraDatoFraGrunnlagForFrontend, trengerTomPeriodisertVurdering } from 'lib/utils/periodisering';

export function getDefaultValuesFromGrunnlag(grunnlag: OvergangArbeidGrunnlag): OvergangArbeidForm {
  if (trengerTomPeriodisertVurdering(grunnlag)) {
    return {
      vurderinger: [
        {
          begrunnelse: '',
          fraDato: getFraDatoFraGrunnlagForFrontend(grunnlag),
          brukerRettPåAAP: '',
          erNyVurdering: true,
        },
      ],
    };
  }

  // Vi har allerede data lagret, vis enten de som er lagret i grunnlaget her eller tom liste
  return {
    vurderinger:
      grunnlag?.nyeVurderinger.map((vurdering) => ({
        begrunnelse: vurdering.begrunnelse,
        fraDato: formaterDatoForFrontend(vurdering.fom),
        brukerRettPåAAP: vurdering.brukerRettPåAAP ? JaEllerNei.Ja : JaEllerNei.Nei,
        vurdertAv: vurdering.vurdertAv,
        kvalitetssikretAv: vurdering.kvalitetssikretAv,
        besluttetAv: vurdering.besluttetAv,
      })) || [],
  };
}

export const mapFormTilDto = (
  periodeForm: OvergangArbeidVurderingForm,
  tilDato: string | undefined | null
): OvergangArbeidLøsning => {
  return {
    begrunnelse: periodeForm.begrunnelse,
    fom: formaterDatoForBackend(parse(periodeForm.fraDato!, 'dd.MM.yyyy', new Date())),
    tom: tilDato,
    brukerRettPåAAP: periodeForm.brukerRettPåAAP === JaEllerNei.Ja,
  };
};
