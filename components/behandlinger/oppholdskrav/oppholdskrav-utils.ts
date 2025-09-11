import { AvklarOppholdkravLøsning, OppholdskravGrunnlagResponse } from 'lib/types/types';
import { OppholdskravForm, OppholdskravVurderingForm } from 'components/behandlinger/oppholdskrav/types';
import { formaterDatoForBackend, formaterDatoForFrontend } from 'lib/utils/date';
import { alleLandUtenNorge } from 'lib/utils/countries';
import { parse } from 'date-fns';
import { getJaNeiEllerUndefined, JaEllerNei } from 'lib/utils/form';

export function getDefaultValuesFromGrunnlag(grunnlag?: OppholdskravGrunnlagResponse): OppholdskravForm {
  if (grunnlag == null || (grunnlag.nyeVurderinger.length === 0 && grunnlag.sisteVedtatteVurderinger.length === 0)) {
    // Vi har ingen tidligere vurderinger eller nye vurderinger, legg til en tom-default-periode
    return {
      vurderinger: [
        {
          begrunnelse: '',
          fraDato: formaterDatoForFrontend(new Date(grunnlag?.kanVurderes[0]?.fom!)),
          land: '',
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
        oppfyller: getJaNeiEllerUndefined(vurdering.oppfylt),
        land: vurdering.land ? getLandkodeOrAnnet(vurdering.land) : '',
        landAnnet: vurdering.land ?? '',
        vurdertAv:
          vurdering.vurdertAv != null
            ? {
                navn: vurdering.vurdertAv.ansattnavn,
                ident: vurdering.vurdertAv.ident,
                dato: vurdering.vurdertAv.dato,
              }
            : undefined,
      })) || [],
  };
}

export const mapFormTilDto = (
  periodeForm: OppholdskravVurderingForm,
  tilDato: string | undefined
): AvklarOppholdkravLøsning => ({
  begrunnelse: periodeForm.begrunnelse,
  fom: formaterDatoForBackend(parse(periodeForm.fraDato!, 'dd.MM.yyyy', new Date())),
  tom: tilDato != null ? formaterDatoForBackend(parse(tilDato, 'dd.MM.yyyy', new Date())) : null,
  oppfylt: periodeForm.oppfyller === JaEllerNei.Ja,
  land: periodeForm.land === 'ANNET' ? periodeForm.landAnnet : periodeForm.land,
});

export function isNotEmpty<T>(item: T | null | undefined): item is T {
  return item != null && item !== '';
}

export function getLandkodeOrAnnet(value: string): string {
  if (alleLandUtenNorge.some((l) => l.value === value)) {
    return value;
  }
  return 'ANNET';
}
