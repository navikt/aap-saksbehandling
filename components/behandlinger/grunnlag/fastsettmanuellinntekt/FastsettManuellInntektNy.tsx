'use client';

import { useLøsBehovOgGåTilNesteSteg } from 'hooks/saksbehandling/LøsBehovOgGåTilNesteStegHook';
import { useConfigForm } from 'components/form/FormHook';
import { FormField, ValuePair } from 'components/form/FormField';
import React, { FormEvent } from 'react';
import { Behovstype } from 'lib/utils/form';
import { useBehandlingsReferanse } from 'hooks/saksbehandling/BehandlingHook';
import { ManuellInntektGrunnlag, ManuellInntektÅr, MellomlagretVurdering } from 'lib/types/types';
import { formaterTilNok } from 'lib/utils/string';
import { useMellomlagring } from 'hooks/saksbehandling/MellomlagringHook';
import { useVilkårskortVisning } from 'hooks/saksbehandling/visning/VisningHook';
import {
  VilkårskortMedFormOgMellomlagringNyVisning,
} from 'components/vilkårskort/vilkårskortmedformogmellomlagringnyvisning/VilkårskortMedFormOgMellomlagringNyVisning';
import { Alert, BodyShort, ErrorMessage, Label, Link, Table, VStack } from '@navikt/ds-react';
import { TableStyled } from 'components/tablestyled/TableStyled';
import { TidligereVurderinger } from 'components/tidligerevurderinger/TidligereVurderinger';
import { deepEqual } from 'components/tidligerevurderinger/TidligereVurderingerUtils';
import { useFieldArray } from 'react-hook-form';
import { TextFieldWrapper } from 'components/form/textfieldwrapper/TextFieldWrapper';
import styles from './FastsettManuellInntekt.module.css';
import { HistoriskManuellVurderingTabell } from './HistoriskManuellVurderingTabell';
import {
  TidligereVurderingExpandableCard,
} from 'components/periodisering/tidligerevurderingexpandablecard/TidligereVurderingExpandableCard';

interface Props {
  heading: string;
  behandlingsversjon: number;
  grunnlag: ManuellInntektGrunnlag;
  readOnly: boolean;
  initialMellomlagretVurdering?: MellomlagretVurdering;
}

interface FormFields {
  begrunnelse: string;
  tabellår: Tabellår[];
}

interface Tabellår {
  år: number;
  ferdigLignetPGI: number | null | undefined;
  beregnetPGI: number | null | undefined;
  eøsInntekt: number | null | undefined;
  totalInntekt: number | null | undefined;
}

type DraftFormFields = Partial<FormFields>;

export const FastsettManuellInntektNy = ({
                                           heading,
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
    mellomlagretVurdering,
  );

  const defaultValue: DraftFormFields = initialMellomlagretVurdering
    ? JSON.parse(initialMellomlagretVurdering.data)
    : mapGrunnlagToDraftFormFields(grunnlag);

  const { form, formFields } = useConfigForm<FormFields>(
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
    { readOnly: formReadOnly },
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
        () => nullstillMellomlagretVurdering(),
      );
    })(event);
  }

  const historiskeManuelleVurderinger = grunnlag.historiskeManuelleVurderinger;
  const årsVurderinger = grunnlag.historiskeManuelleVurderinger?.map((it) => it.årsVurderinger);

  return (
    <VilkårskortMedFormOgMellomlagringNyVisning
      heading={heading}
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
      {!!historiskeManuelleVurderinger?.length && (
        <TidligereVurderinger
          data={historiskeManuelleVurderinger}
          buildFelter={byggFelter}
          getErGjeldende={(v) => deepEqual(v, historiskeManuelleVurderinger[historiskeManuelleVurderinger.length - 1])}
          getFomDato={(v) => v.vurdertAv.dato}
          getVurdertAvIdent={(v) => v.vurdertAv.ident}
          getVurdertDato={(v) => v.vurdertAv.dato}
        >

          {årsVurderinger?.map(((vurdering, index) => (
            <HistoriskManuellVurderingTabell
              key={index}
              historiskeManuelleVurderinger={vurdering}
            ></HistoriskManuellVurderingTabell>
          )))}
        </TidligereVurderinger>
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
      <Link href="https://lovdata.no/pro/rundskriv/r45-00/KAPITTEL_10-7-3'" target="_blank" rel="noopener noreferrer">
        Du kan lese mer om hvordan EØS inntekt skal beregnes i rundskrivet til § 11-7 (lovdata.no)
      </Link>
      <FormField form={form} formField={formFields.begrunnelse} />
      <VStack gap={'2'}>
        <Label size={'small'}>Hvilke år skal inntekt overstyres?</Label>
        <TableStyled>
          <Table.Header>
            <Table.Row>
              <Table.HeaderCell textSize={'small'}>År</Table.HeaderCell>
              <Table.HeaderCell textSize={'small'}>Ferdig lignet PGI</Table.HeaderCell>
              <Table.HeaderCell textSize={'small'}>Beregnet PGI</Table.HeaderCell>
              <Table.HeaderCell textSize={'small'}>EØS inntekt</Table.HeaderCell>
              <Table.HeaderCell textSize={'small'}>Totalt</Table.HeaderCell>
              <Table.HeaderCell></Table.HeaderCell>
            </Table.Row>
          </Table.Header>
          <Table.Body data-testid={'inntektstabell'}>
            {/* TODO Putt tabell i egen fil */}
            {tabellår.map((år, index) => {
              const ferdigLignetPGI = form.watch(`tabellår.${index}.ferdigLignetPGI`);
              const beregnetPGI = form.watch(`tabellår.${index}.beregnetPGI`);
              const eøsInntekt = form.watch(`tabellår.${index}.eøsInntekt`);
              return (
                <Table.Row key={år.år}>
                  <Table.DataCell textSize={'small'}>{år.år}</Table.DataCell>
                  <Table.DataCell textSize={'small'} data-testid={'ferdigLignetPGI'}>
                    {år.ferdigLignetPGI ? formaterTilNok(år.ferdigLignetPGI) : '-'}
                  </Table.DataCell>
                  <Table.DataCell textSize={'small'} data-testid={'beregnetPGI'}>
                    <TextFieldWrapper
                      className={styles.inntektfelt}
                      name={`tabellår.${index}.beregnetPGI`}
                      control={form.control}
                      type={'number'}
                      hideLabel={true}
                      readOnly={readOnly || år.ferdigLignetPGI !== undefined}
                    />
                  </Table.DataCell>
                  <Table.DataCell textSize={'small'} data-testid={'eøsInntekt'}>
                    <TextFieldWrapper
                      className={styles.inntektfelt}
                      name={`tabellår.${index}.eøsInntekt`}
                      control={form.control}
                      type={'number'}
                      hideLabel={true}
                      readOnly={readOnly}
                    />
                  </Table.DataCell>
                  <Table.DataCell data-testid={'totalt'} textSize={'small'}>
                    {regnUtTotalbeløpPerÅr(ferdigLignetPGI ?? 0, beregnetPGI ?? 0, eøsInntekt ?? 0)}
                  </Table.DataCell>
                </Table.Row>
              );
            })}
          </Table.Body>
        </TableStyled>
        {form.formState.errors.tabellår && (
          <ErrorMessage size={'small'} showIcon>
            {form.formState.errors.tabellår[0]?.message}
          </ErrorMessage>
        )}
      </VStack>
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

const regnUtTotalbeløpPerÅr = (ferdigLignetPGI: number, beregnetPGI: number, eøsInntekt: number): string => {
  const total =
    beregnetPGI > 0 ? Number(beregnetPGI) + Number(eøsInntekt) : Number(ferdigLignetPGI) + Number(eøsInntekt);
  return formaterTilNok(total);
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
];
