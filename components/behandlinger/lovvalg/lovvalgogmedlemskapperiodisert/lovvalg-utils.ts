import {
  AvklarPeriodisertLovvalgMedlemskapLøsning,
  LovvalgEØSLand,
  MellomlagretVurdering,
  PeriodisertLovvalgMedlemskapGrunnlag,
} from 'lib/types/types';
import { formaterDatoForBackend, formaterDatoForFrontend } from 'lib/utils/date';
import { getJaNeiEllerUndefined, JaEllerNei } from 'lib/utils/form';
import {
  LovOgMedlemskapVurderingForm,
  LovOgMedlemskapVurderingFormIkkePeriodisert,
  LovvalgOgMedlemskapManuellVurderingForm,
} from 'components/behandlinger/lovvalg/lovvalgogmedlemskapperiodisert/types';
import { parse, sub } from 'date-fns';
import {
  getFraDatoFraGrunnlagForFrontend,
  hentPerioderSomTrengerVurdering,
  trengerVurderingsForslag,
} from 'lib/utils/periodisering';

function tomLovvalgMedlemskapVurdering(): LovvalgOgMedlemskapManuellVurderingForm {
  return {
    lovvalg: {
      begrunnelse: '',
      lovvalgsEØSLand: '',
    },
    medlemskap: undefined,
    fraDato: '',
  };
}

export function getDefaultValuesFromGrunnlag(
  grunnlag: PeriodisertLovvalgMedlemskapGrunnlag
): LovOgMedlemskapVurderingForm {
  if (trengerVurderingsForslag(grunnlag)) {
    return hentPerioderSomTrengerVurdering(grunnlag, tomLovvalgMedlemskapVurdering);
  }

  // Vi har allerede data lagret, vis enten de som er lagret i grunnlaget her eller tom liste
  return {
    vurderinger:
      grunnlag?.nyeVurderinger.map((vurdering) => ({
        fraDato: formaterDatoForFrontend(vurdering.fom),
        lovvalg: {
          begrunnelse: vurdering.lovvalg.begrunnelse,
          lovvalgsEØSLand: mapGrunnlagTilLovvalgsland(vurdering.lovvalg.lovvalgsEØSLandEllerLandMedAvtale)!,
          annetLovvalgslandMedAvtale: mapGrunnlagTilAnnetLovvalgslandMedAvtale(
            vurdering.lovvalg.lovvalgsEØSLandEllerLandMedAvtale
          ),
        },
        medlemskap: {
          begrunnelse: vurdering.medlemskap?.begrunnelse ?? '',
          varMedlemIFolketrygd: getJaNeiEllerUndefined(vurdering.medlemskap?.varMedlemIFolketrygd) ?? JaEllerNei.Nei,
        },
        vurdertAv: vurdering.vurdertAv,
        kvalitetssikretAv: vurdering.kvalitetssikretAv,
        besluttetAv: vurdering.besluttetAv,
      })) || [],
  };
}

export const mapFormTilDto = (
  periodeForm: LovvalgOgMedlemskapManuellVurderingForm,
  tilDato: string | undefined
): AvklarPeriodisertLovvalgMedlemskapLøsning => ({
  begrunnelse: `${periodeForm.lovvalg.begrunnelse}\n\n${periodeForm.medlemskap ? periodeForm.medlemskap.begrunnelse : ''}`,
  fom: formaterDatoForBackend(parse(periodeForm.fraDato!, 'dd.MM.yyyy', new Date())),
  tom: tilDato != null ? formaterDatoForBackend(sub(parse(tilDato, 'dd.MM.yyyy', new Date()), { days: 1 })) : null,
  lovvalg: {
    begrunnelse: periodeForm.lovvalg.begrunnelse,
    lovvalgsEØSLandEllerLandMedAvtale:
      periodeForm.lovvalg.lovvalgsEØSLand === 'Annet land med avtale'
        ? (periodeForm.lovvalg.annetLovvalgslandMedAvtale as LovvalgEØSLand)
        : 'NOR',
  },
  ...(periodeForm.lovvalg.lovvalgsEØSLand === 'Norge' && {
    medlemskap: {
      begrunnelse: periodeForm.medlemskap?.begrunnelse ?? '',
      varMedlemIFolketrygd: periodeForm.medlemskap?.varMedlemIFolketrygd === JaEllerNei.Ja,
    },
  }),
});

function mapGrunnlagTilLovvalgsland(lovvalgsland?: LovvalgEØSLand) {
  if (lovvalgsland === 'NOR') {
    return 'Norge';
  } else if (lovvalgsland) {
    return 'Annet land med avtale';
  }
  return undefined;
}

function mapGrunnlagTilAnnetLovvalgslandMedAvtale(lovvalgsland?: LovvalgEØSLand) {
  if (lovvalgsland && lovvalgsland !== 'NOR') {
    return lovvalgsland;
  }
  return undefined;
}

// TODO denne er midlertidig inntil alle mellomlagrede vurderinger har blitt periodisert (https://jira.adeo.no/browse/FAGSYSTEM-405014)
export function hentPeriodiserteVerdierFraMellomlagretVurdering(
  mellomlagretVurdering: MellomlagretVurdering,
  grunnlag?: PeriodisertLovvalgMedlemskapGrunnlag
) {
  const vurdering = JSON.parse(mellomlagretVurdering.data);
  if (vurdering.vurderinger) {
    return vurdering as LovOgMedlemskapVurderingForm;
  } else {
    const ikkePeriodisertVurdering = vurdering as LovOgMedlemskapVurderingFormIkkePeriodisert;
    return {
      vurderinger: [
        {
          lovvalg: {
            begrunnelse: ikkePeriodisertVurdering.lovvalgBegrunnelse,
            lovvalgsEØSLand: ikkePeriodisertVurdering.lovvalgsLand,
          },
          medlemskap: {
            begrunnelse: ikkePeriodisertVurdering.medlemskapBegrunnelse,
            varMedlemIFolketrygd: ikkePeriodisertVurdering.medlemAvFolkeTrygdenVedSøknadstidspunkt,
          },
          fraDato: getFraDatoFraGrunnlagForFrontend(grunnlag),
        },
      ],
    } as LovOgMedlemskapVurderingForm;
  }
}
