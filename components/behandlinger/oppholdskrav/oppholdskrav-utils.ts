import { AvklarOppholdkravLøsning, OppholdskravGrunnlagResponse } from 'lib/types/types';
import { OppholdskravForm, OppholdskravVurderingForm } from 'components/behandlinger/oppholdskrav/types';
import { formaterDatoForBackend, formaterDatoForFrontend, parseDatoFraDatePicker } from 'lib/utils/date';
import { alleLandUtenNorge } from 'lib/utils/countries';
import { parse, sub } from 'date-fns';
import { getJaNeiEllerUndefined, JaEllerNei } from 'lib/utils/form';
import { hentPerioderSomTrengerVurdering, trengerVurderingsForslag } from 'lib/utils/periodisering';

export function getDefaultValuesFromGrunnlag(grunnlag: OppholdskravGrunnlagResponse): OppholdskravForm {
  if (trengerVurderingsForslag(grunnlag)) {
    return hentPerioderSomTrengerVurdering(grunnlag, () => ({
      begrunnelse: '',
      fraDato: '',
      land: '',
      erNyVurdering: true,
      behøverVurdering: false,
    }));
  }

  // Vi har allerede data lagret, vis enten de som er lagret i grunnlaget her eller tom liste
  return {
    vurderinger:
      grunnlag?.nyeVurderinger.map((vurdering) => ({
        begrunnelse: vurdering.begrunnelse,
        fraDato: formaterDatoForFrontend(vurdering.fom),
        oppfyller: getJaNeiEllerUndefined(vurdering.oppfylt),
        land: vurdering.land ? getLandkodeOrAnnet(vurdering.land) : '',
        landAnnet: vurdering.land ?? '',
        vurdertAv: vurdering.vurdertAv,
        kvalitetssikretAv: vurdering.kvalitetssikretAv,
        besluttetAv: vurdering.besluttetAv,
        erNyVurdering: false,
        behøverVurdering: false,
      })) || [],
  };
}

export const mapFormTilDto = (
  periodeForm: OppholdskravVurderingForm,
  tilDato: string | undefined | null
): AvklarOppholdkravLøsning => {
  return {
    begrunnelse: periodeForm.begrunnelse,
    fom: formaterDatoForBackend(parse(periodeForm.fraDato!, 'dd.MM.yyyy', new Date())),
    tom: tilDato,
    oppfylt: periodeForm.oppfyller === JaEllerNei.Ja,
    land: periodeForm.land === 'ANNET' ? periodeForm.landAnnet : periodeForm.land,
  };
};

export function parseDatoFraDatePickerOgTrekkFra1Dag(datoFraDatepicker?: string) {
  const parsedDate = parseDatoFraDatePicker(datoFraDatepicker);
  if (parsedDate == null) {
    return null;
  }

  return sub(parsedDate, { days: 1 });
}

export function isNotEmpty<T>(item: T | null | undefined): item is T {
  return item != null && item !== '';
}

export function getLandkodeOrAnnet(value: string): string {
  if (alleLandUtenNorge.some((l) => l.value === value)) {
    return value;
  }
  return 'ANNET';
}
