'use client';

import { useLøsBehovOgGåTilNesteSteg } from 'hooks/saksbehandling/LøsBehovOgGåTilNesteStegHook';
import { useConfigForm } from 'components/form/FormHook';
import { FormField, ValuePair } from 'components/form/FormField';
import React, { FormEvent } from 'react';
import { Behovstype } from 'lib/utils/form';
import { useBehandlingsReferanse } from 'hooks/saksbehandling/BehandlingHook';
import { ManuellInntektGrunnlag, ManuellInntektÅr, MellomlagretVurdering } from 'lib/types/types';
import { useMellomlagring } from 'hooks/saksbehandling/MellomlagringHook';
import { useVilkårskortVisning } from 'hooks/saksbehandling/visning/VisningHook';
import { VilkårskortMedFormOgMellomlagringNyVisning } from 'components/vilkårskort/vilkårskortmedformogmellomlagringnyvisning/VilkårskortMedFormOgMellomlagringNyVisning';
import { Alert, BodyShort, Link } from '@navikt/ds-react';
import { TidligereVurderinger } from 'components/tidligerevurderinger/TidligereVurderinger';
import { deepEqual } from 'components/tidligerevurderinger/TidligereVurderingerUtils';
import { useFieldArray } from 'react-hook-form';
import { FastsettManuellInntektTabell } from 'components/behandlinger/grunnlag/fastsettmanuellinntekt/FastsettManuellInntektTabell';
import { FastsettManuellInntektForm, Tabellår } from 'components/behandlinger/grunnlag/fastsettmanuellinntekt/types';

interface Props {
  behandlingsversjon: number;
  grunnlag: ManuellInntektGrunnlag;
  readOnly: boolean;
  initialMellomlagretVurdering?: MellomlagretVurdering;
}

type DraftFormFields = Partial<FastsettManuellInntektForm>;

export const FastsettManuellInntektNy = ({
  behandlingsversjon,
  grunnlag,
  readOnly,
  initialMellomlagretVurdering,
}: Props) => {
  const behandlingsReferanse = useBehandlingsReferanse();
  const { løsBehovOgGåTilNesteSteg, isLoading, status, løsBehovOgGåTilNesteStegError } =
    useLøsBehovOgGåTilNesteSteg('MANGLENDE_LIGNING');

  const { lagreMellomlagring, slettMellomlagring, mellomlagretVurdering, nullstillMellomlagretVurdering } =
    useMellomlagring(Behovstype.FASTSETT_MANUELL_INNTEKT, initialMellomlagretVurdering);

  const { visningActions, formReadOnly, visningModus } = useVilkårskortVisning(
    readOnly,
    'MANGLENDE_LIGNING',
    mellomlagretVurdering
  );

  const visHovedinnhold = !formReadOnly || grunnlag.manuelleVurderinger !== null;

  const defaultValue: DraftFormFields = initialMellomlagretVurdering
    ? JSON.parse(initialMellomlagretVurdering.data)
    : mapGrunnlagToDraftFormFields(grunnlag);

  const { form, formFields } = useConfigForm<FastsettManuellInntektForm>(
    {
      begrunnelse: {
        type: 'textarea',
        label: 'Begrunnelse for endret arbeidsinntekt',
        rules: { required: 'Du må gi en begrunnelse.' },
        defaultValue: defaultValue.begrunnelse,
      },
      tabellår: {
        type: 'fieldArray',
        label: 'Hvilke år skal inntekt overstyres?',
        defaultValue: defaultValue.tabellår,
      },
    },
    { readOnly: formReadOnly }
  );

  const { fields: tabellår } = useFieldArray({
    name: 'tabellår',
    control: form.control,
    rules: {
      validate: (år) => {
        const manglerPGI = år.some((år) => {
          return år.ferdigLignetPGI === undefined && år.beregnetPGI === undefined;
        });
        if (manglerPGI) {
          form.setError('tabellår', {
            type: 'custom',
            message: 'Du må fylle inn beregnet PGI',
          });
          return false;
        }
      },
    },
  });

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    form.handleSubmit((data) => {
      løsBehovOgGåTilNesteSteg(
        {
          behandlingVersjon: behandlingsversjon,
          behov: {
            behovstype: Behovstype.FASTSETT_MANUELL_INNTEKT,
            manuellVurderingForManglendeInntekt: {
              begrunnelse: data.begrunnelse,
              belop: 0, // TODO Deprecated
              vurderinger: data.tabellår.map((år) => ({
                år: år.år,
                beløp: år.beregnetPGI,
                eøsBeløp: år.eøsInntekt,
              })),
            },
          },
          referanse: behandlingsReferanse,
        },
        () => nullstillMellomlagretVurdering()
      );
    })(event);
  }

  const historiskeVurderinger = grunnlag.historiskeVurderinger;

  return (
    <VilkårskortMedFormOgMellomlagringNyVisning
      heading={'Manglende pensjonsgivende inntekter / EØS inntekter'}
      steg={'MANGLENDE_LIGNING'}
      onSubmit={handleSubmit}
      isLoading={isLoading}
      løsBehovOgGåTilNesteStegError={løsBehovOgGåTilNesteStegError}
      status={status}
      vilkårTilhørerNavKontor={false}
      vurdertAvAnsatt={grunnlag.vurdering?.vurdertAv}
      onLagreMellomLagringClick={() => lagreMellomlagring(form.watch())}
      onDeleteMellomlagringClick={() => {
        slettMellomlagring(() => {
          form.reset(grunnlag ? mapGrunnlagToDraftFormFields(grunnlag) : emptyDraftFormFields());
        });
      }}
      mellomlagretVurdering={mellomlagretVurdering}
      visningModus={visningModus}
      visningActions={visningActions}
      formReset={() => form.reset(mellomlagretVurdering ? JSON.parse(mellomlagretVurdering.data) : undefined)}
    >
      {/* TODO denne er ikke testet at funker som forventet */}
      {!!historiskeVurderinger?.length && (
        <TidligereVurderinger
          data={historiskeVurderinger}
          buildFelter={byggFelter}
          getErGjeldende={(v) => deepEqual(v, historiskeVurderinger[historiskeVurderinger.length - 1])}
          getFomDato={(v) => v.vurderingenGjelderFra ?? v.vurdertAv.dato}
          getVurdertAvIdent={(v) => v.vurdertAv.ident}
          getVurdertDato={(v) => v.vurdertAv.dato}
        />
      )}
      {grunnlag.registrerteInntekterSisteRelevanteAr.length < 3 && (
        <Alert variant={'warning'} size={'small'}>
          Du må oppgi pensjonsgivende inntekt for år hvor inntekten ikke er ferdig lignet.
        </Alert>
      )}
      <BodyShort>
        Hvis det mangler pensjonsgivende inntekt for noen av beregningsårene, eller brukerens inntekt skal beregnes med
        utgangspunkt i arbeidsperioder i EØS, så kan brukerens inntekt overstyres. Inntekter skal ikke oppjusteres etter
        G, da det gjøres automatisk av systemet.
      </BodyShort>
      {visHovedinnhold && (
        <>
          <Link
            href="https://lovdata.no/pro/rundskriv/r45-00/KAPITTEL_10-7-3'"
            target="_blank"
            rel="noopener noreferrer"
          >
            Du kan lese mer om hvordan EØS inntekt skal beregnes i rundskrivet til § 11-7 (lovdata.no)
          </Link>
          <FormField form={form} formField={formFields.begrunnelse} />
          <FastsettManuellInntektTabell form={form} tabellår={tabellår} />
        </>
      )}
    </VilkårskortMedFormOgMellomlagringNyVisning>
  );
};

/**
 * Sikre at inntektstabellen alltid inneholder de tre siste relevante beregningsårene.
 */
const berikMedManglendeÅr = (sisteÅr: number): Tabellår[] => {
  return [sisteÅr - 2, sisteÅr - 1, sisteÅr].map((år) => ({
    år: år,
    ferdigLignetPGI: undefined,
    beregnetPGI: undefined,
    eøsInntekt: undefined,
    totalInntekt: undefined,
  }));
};

/**
 * Berik siste tre relevante beregningsår med pensjonsgivende inntekter fra grunnlag dersom de finnes.
 */
const berikMedInntekterFraGrunnlag = (treÅr: Tabellår[], inntekterFraGrunnlag: ManuellInntektÅr[]): Tabellår[] => {
  return treÅr.map((år) => {
    const inntekter = inntekterFraGrunnlag.find((inntekter) => inntekter.år === år.år);
    return {
      år: år.år,
      ferdigLignetPGI: inntekter?.beløp,
      beregnetPGI: undefined,
      eøsInntekt: undefined,
      totalInntekt: undefined,
    };
  });
};

/**
 * Berik med manuelle inntekter dersom disse er lagt inn av saksbehandler.
 */
const berikMedManuelleInntekter = (treÅr: Tabellår[], manuelleInntekter: ManuellInntektÅr[]): Tabellår[] => {
  return treÅr.map((år) => {
    const inntekter = manuelleInntekter.find((inntekter) => inntekter.år === år.år);
    return {
      år: år.år,
      ferdigLignetPGI: år.ferdigLignetPGI,
      beregnetPGI: inntekter?.beløp,
      eøsInntekt: inntekter?.eøsBeløp,
      totalInntekt: undefined,
    };
  });
};

const byggTabellData = (grunnlag: ManuellInntektGrunnlag): Tabellår[] => {
  const inntekterFraGrunnlag = grunnlag.registrerteInntekterSisteRelevanteAr;
  const manuelleInntekter = grunnlag.manuelleVurderinger?.årsVurderinger || [];

  let tabellår: Tabellår[] = [];
  tabellår = berikMedManglendeÅr(grunnlag.ar);
  tabellår = berikMedInntekterFraGrunnlag(tabellår, inntekterFraGrunnlag);
  tabellår = berikMedManuelleInntekter(tabellår, manuelleInntekter);
  return tabellår;
};

const mapGrunnlagToDraftFormFields = (grunnlag: ManuellInntektGrunnlag): DraftFormFields => {
  return {
    begrunnelse: grunnlag.manuelleVurderinger?.begrunnelse,
    tabellår: byggTabellData(grunnlag),
  };
};

const emptyDraftFormFields = (): DraftFormFields => {
  return {
    begrunnelse: '',
    tabellår: [],
  };
};

const byggFelter = (manuelleVurderinger: ManuellInntektGrunnlag['manuelleVurderinger']): ValuePair[] => [
  {
    label: 'Begrunnelse for arbeidsinntekt',
    value: manuelleVurderinger?.begrunnelse ?? '-',
  },
  {
    label: 'Hvilke år skal inntekt overstyres?',
    value: '-',
  },
];
