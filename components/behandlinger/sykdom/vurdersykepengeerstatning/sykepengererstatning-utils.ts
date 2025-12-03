import {
  SykepengeerstatningGrunnlag,
  SykepengeerstatningVurderingGrunn,
  SykepengererstatningPeriodeLøsning,
} from 'lib/types/types';
import { formaterDatoForBackend, formaterDatoForFrontend } from 'lib/utils/date';
import { JaEllerNei } from 'lib/utils/form';
import {
  SykepengeerstatningForm,
  SykepengeerstatningVurderingForm,
} from 'components/behandlinger/sykdom/vurdersykepengeerstatning/sykepengererstating-types';
import { parse } from 'date-fns';
import { ValuePair } from 'components/form/FormField';

export function getDefaultValuesFromGrunnlag(grunnlag?: SykepengeerstatningGrunnlag): SykepengeerstatningForm {
  if (grunnlag == null) {
    return {
      vurderinger: [
        {
          begrunnelse: '',
          fraDato: '',
          grunn: null,
          erOppfylt: '',
        },
      ],
    };
  }

  if (grunnlag.nyeVurderinger.length === 0 && grunnlag.sisteVedtatteVurderinger.length === 0) {
    // Vi har ingen tidligere vurderinger eller nye vurderinger, legg til en tom-default-periode
    return {
      vurderinger: [
        {
          begrunnelse: '',
          fraDato: formaterDatoForFrontend(new Date(grunnlag?.behøverVurderinger[0]?.fom!)),
          grunn: null,
          erOppfylt: '',
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
        erOppfylt: vurdering.harRettPå ? JaEllerNei.Ja : JaEllerNei.Nei,
        grunn: vurdering.grunn,
        vurdertAv: vurdering.vurdertAv,
      })) || [],
  };
}

export const mapFormTilDto = (
  periodeForm: SykepengeerstatningVurderingForm,
  tilDato: string | undefined | null
): SykepengererstatningPeriodeLøsning => {
  return {
    begrunnelse: periodeForm.begrunnelse,
    fom: formaterDatoForBackend(parse(periodeForm.fraDato!, 'dd.MM.yyyy', new Date())),
    tom: tilDato,
    harRettPå: periodeForm.erOppfylt === JaEllerNei.Ja,
    dokumenterBruktIVurdering: [],
    grunn: periodeForm.grunn,
  };
};

export const grunnOptions: ValuePair<NonNullable<SykepengeerstatningVurderingGrunn>>[] = [
  {
    label:
      'Brukeren har tidligere mottatt arbeidsavklaringspenger og innen seks måneder etter at arbeidsavklaringspengene er opphørt, blir arbeidsufør som følge av en annen sykdom',
    value: 'ANNEN_SYKDOM_INNEN_SEKS_MND',
  },
  {
    label:
      'Brukeren har tidligere mottatt arbeidsavklaringspenger og innen ett år etter at arbeidsavklaringspengene er opphørt, blir arbeidsufør som følge av samme sykdom',
    value: 'SAMME_SYKDOM_INNEN_ETT_AAR',
  },
  {
    label:
      'Brukeren har tidligere mottatt sykepenger etter kapittel 8 i til sammen 248, 250 eller 260 sykepengedager i løpet av de tre siste årene, se § 8-12, og igjen blir arbeidsufør på grunn av sykdom eller skade mens han eller hun er i arbeid',
    value: 'SYKEPENGER_IGJEN_ARBEIDSUFOR',
  },
  {
    label:
      'Brukeren har tidligere mottatt sykepenger etter kapittel 8 i til sammen 248, 250 eller 260 sykepengedager i løpet av de tre siste årene, se § 8-12, og fortsatt er arbeidsufør på grunn av sykdom eller skade',
    value: 'SYKEPENGER_FORTSATT_ARBEIDSUFOR',
  },
  {
    label:
      'Brukeren har mottatt arbeidsavklaringspenger og deretter foreldrepenger og innen seks måneder etter foreldrepengene opphørte, blir arbeidsufør på grunn av sykdom eller skade, se § 8-2 andre ledd',
    value: 'FORELDREPENGER_INNEN_SEKS_MND',
  },
];
