import {
  AvklarPeriodisertForutgåendeMedlemskapLøsning,
  MellomlagretVurdering,
  PeriodisertForutgåendeMedlemskapGrunnlag,
} from 'lib/types/types';
import { formaterDatoForBackend, formaterDatoForFrontend } from 'lib/utils/date';
import { JaEllerNei } from 'lib/utils/form';
import { parse, sub } from 'date-fns';
import {
  ForutgåendeMedlemskapManuellVurderingForm,
  ForutgåendeMedlemskapVurderingForm,
  ForutgåendeMedlemskapVurderingFormIkkePeriodisert,
} from 'components/behandlinger/forutgåendemedlemskap/manuellvurderingperiodisert/types';

export function getDefaultValuesFromGrunnlag(
  grunnlag?: PeriodisertForutgåendeMedlemskapGrunnlag
): ForutgåendeMedlemskapVurderingForm {
  if (grunnlag == null || (grunnlag.nyeVurderinger.length === 0 && grunnlag.sisteVedtatteVurderinger.length === 0)) {
    // Vi har ingen tidligere vurderinger eller nye vurderinger, legg til en tom-default-periode
    return {
      vurderinger: [
        {
          begrunnelse: '',
          fraDato: formaterDatoForFrontend(new Date(grunnlag?.kanVurderes[0]?.fom!)),
        },
      ],
    };
  }

  // Vi har allerede data lagret, vis enten de som er lagret i grunnlaget her eller tom liste
  return {
    vurderinger:
      grunnlag?.nyeVurderinger.map((vurdering) => ({
        fraDato: formaterDatoForFrontend(vurdering.fom),
        begrunnelse: vurdering.begrunnelse,
        harForutgåendeMedlemskap: mapGrunnlagTilForutgående(vurdering.harForutgåendeMedlemskap),
        unntaksvilkår: mapGrunnlagTilUnntaksvilkår(
          vurdering.harForutgåendeMedlemskap,
          vurdering.varMedlemMedNedsattArbeidsevne,
          vurdering.medlemMedUnntakAvMaksFemAar
        ),
        vurdertAv:
          vurdering.vurdertAv != null
            ? {
                ansattnavn: vurdering.vurdertAv.ansattnavn,
                ident: vurdering.vurdertAv.ident,
                dato: vurdering.vurdertAv.dato,
              }
            : undefined,
      })) || [],
  };
}

export const mapFormTilDto = (
  periodeForm: ForutgåendeMedlemskapManuellVurderingForm,
  tilDato: string | undefined
): AvklarPeriodisertForutgåendeMedlemskapLøsning => ({
  begrunnelse: periodeForm.begrunnelse,
  fom: formaterDatoForBackend(parse(periodeForm.fraDato!, 'dd.MM.yyyy', new Date())),
  tom: tilDato != null ? formaterDatoForBackend(sub(parse(tilDato, 'dd.MM.yyyy', new Date()), { days: 1 })) : null,
  harForutgåendeMedlemskap: periodeForm.harForutgåendeMedlemskap === JaEllerNei.Ja,
  ...(periodeForm.unntaksvilkår !== undefined &&
    periodeForm.unntaksvilkår === 'A' && {
      varMedlemMedNedsattArbeidsevne: true,
    }),
  ...(periodeForm.unntaksvilkår !== undefined &&
    periodeForm.unntaksvilkår === 'B' && {
      medlemMedUnntakAvMaksFemAar: true,
    }),
});

// TODO denne er midlertidig inntil alle mellomlagrede vurderinger har blitt periodisert (https://jira.adeo.no/browse/FAGSYSTEM-405014)
export function hentPeriodiserteVerdierFraMellomlagretVurdering(
  mellomlagretVurdering: MellomlagretVurdering,
  grunnlag?: PeriodisertForutgåendeMedlemskapGrunnlag
) {
  const vurdering = JSON.parse(mellomlagretVurdering.data);
  if (vurdering.vurderinger) {
    return vurdering as ForutgåendeMedlemskapVurderingForm;
  } else {
    const ikkePeriodisertVurdering = vurdering as ForutgåendeMedlemskapVurderingFormIkkePeriodisert;
    return {
      vurderinger: [
        {
          begrunnelse: ikkePeriodisertVurdering.begrunnelse,
          harForutgåendeMedlemskap: ikkePeriodisertVurdering.harForutgåendeMedlemskap,
          unntaksvilkår: ikkePeriodisertVurdering.unntaksvilkår,
          fraDato: grunnlag ? formaterDatoForFrontend(new Date(grunnlag?.kanVurderes[0]?.fom!)) : undefined,
        },
      ],
    } as ForutgåendeMedlemskapVurderingForm;
  }
}

function mapGrunnlagTilForutgående(harForutgåendeMedlemskap?: boolean | null) {
  if (harForutgåendeMedlemskap === true) {
    return JaEllerNei.Ja;
  } else if (harForutgåendeMedlemskap === false) {
    return JaEllerNei.Nei;
  }
  return undefined;
}

function mapGrunnlagTilUnntaksvilkår(
  harForutgåendeMedlemskap?: boolean | null,
  varMedlemMedNedsattArbeidsevne?: boolean | null,
  medlemMedUnntakAvMaksFemÅr?: boolean | null
) {
  if (varMedlemMedNedsattArbeidsevne === true) {
    return 'A';
  } else if (medlemMedUnntakAvMaksFemÅr === true) {
    return 'B';
  } else if (harForutgåendeMedlemskap !== undefined && harForutgåendeMedlemskap !== null) {
    return 'Nei';
  }
  return undefined;
}
