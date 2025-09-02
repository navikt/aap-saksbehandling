'use client';

import { VilkårskortMedFormOgMellomlagring } from 'components/vilkårskort/vilkårskortmedformogmellomlagring/VilkårskortMedFormOgMellomlagring';
import { useLøsBehovOgGåTilNesteSteg } from 'hooks/saksbehandling/LøsBehovOgGåTilNesteStegHook';
import { BodyShort, Table, VStack } from '@navikt/ds-react';
import { MellomlagretVurdering, SamordningTjenestePensjonGrunnlag } from 'lib/types/types';
import { TableStyled } from 'components/tablestyled/TableStyled';
import { useConfigForm } from 'components/form/FormHook';
import { Behovstype, getJaNeiEllerUndefined, JaEllerNei, JaEllerNeiOptions } from 'lib/utils/form';
import { FormField } from 'components/form/FormField';
import { formaterPeriode } from 'lib/utils/date';
import { FormEvent } from 'react';
import { useBehandlingsReferanse } from 'hooks/saksbehandling/BehandlingHook';
import { useMellomlagring } from 'hooks/saksbehandling/MellomlagringHook';

interface Props {
  grunnlag: SamordningTjenestePensjonGrunnlag;
  behandlingVersjon: number;
  readOnly: boolean;
  initialMellomlagretVurdering?: MellomlagretVurdering;
}

interface FormFields {
  begrunnelse: string;
  skalEtterbetalingHoldesIgjen: JaEllerNei;
}

type DraftFormFields = Partial<FormFields>;

export const SamordningTjenestePensjon = ({
  grunnlag,
  behandlingVersjon,
  readOnly,
  initialMellomlagretVurdering,
}: Props) => {
  const behandlingsReferanse = useBehandlingsReferanse();
  const { løsBehovOgGåTilNesteSteg, status, løsBehovOgGåTilNesteStegError, isLoading } = useLøsBehovOgGåTilNesteSteg(
    'SAMORDNING_TJENESTEPENSJON_REFUSJONSKRAV'
  );

  const { lagreMellomlagring, slettMellomlagring, nullstillMellomlagretVurdering, mellomlagretVurdering } =
    useMellomlagring(Behovstype.SAMORDNING_REFUSJONS_KRAV, initialMellomlagretVurdering);

  const defaultValues: DraftFormFields = initialMellomlagretVurdering
    ? JSON.parse(initialMellomlagretVurdering.data)
    : mapVurderingToDraftFormFields(grunnlag.tjenestepensjonRefusjonskravVurdering);

  const { form, formFields } = useConfigForm<FormFields>(
    {
      begrunnelse: {
        type: 'textarea',
        label: 'Vurdering',
        description: 'Vurder om etterbetaling for perioden skal holdes igjen i påvente av refusjonskrav.',
        defaultValue: defaultValues.begrunnelse,
        rules: { required: 'Du må gi en begrunnelse.' },
      },
      skalEtterbetalingHoldesIgjen: {
        type: 'radio',
        options: JaEllerNeiOptions,
        label: 'Skal etterbetaling holdes igjen for perioden?',
        defaultValue: defaultValues.skalEtterbetalingHoldesIgjen,
        rules: { required: 'Du må svare på om etterbetalingen skal holdes igjen.' },
      },
    },
    { readOnly }
  );

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    form.handleSubmit((data) =>
      løsBehovOgGåTilNesteSteg(
        {
          behandlingVersjon: behandlingVersjon,
          behov: {
            behovstype: Behovstype.SAMORDNING_REFUSJONS_KRAV,
            samordningRefusjonskrav: {
              begrunnelse: data.begrunnelse,
              harKrav: data.skalEtterbetalingHoldesIgjen === JaEllerNei.Ja,
            },
          },
          referanse: behandlingsReferanse,
        },
        () => nullstillMellomlagretVurdering()
      )
    )(event);
  };

  return (
    <VilkårskortMedFormOgMellomlagring
      heading={'Refusjonskrav tjenestepensjon'}
      status={status}
      isLoading={isLoading}
      løsBehovOgGåTilNesteStegError={løsBehovOgGåTilNesteStegError}
      vilkårTilhørerNavKontor={false}
      steg={'SAMORDNING_TJENESTEPENSJON_REFUSJONSKRAV'}
      visBekreftKnapp={!readOnly}
      onSubmit={handleSubmit}
      mellomlagretVurdering={mellomlagretVurdering}
      onLagreMellomLagringClick={() => lagreMellomlagring(form.watch())}
      onDeleteMellomlagringClick={() =>
        slettMellomlagring(() =>
          form.reset(
            grunnlag.tjenestepensjonRefusjonskravVurdering
              ? mapVurderingToDraftFormFields(grunnlag.tjenestepensjonRefusjonskravVurdering)
              : emptyDraftFormFields()
          )
        )
      }
      readOnly={readOnly}
    >
      <VStack gap={'1'}>
        <BodyShort weight={'semibold'}>
          Vi har funnet perioder der brukeren kan ha mottatt tjenestepensjonsordning
        </BodyShort>
        <BodyShort>Disse kan føre til refusjonskrav på etterbetaling.</BodyShort>
      </VStack>

      <TableStyled>
        <Table.Header>
          <Table.Row>
            <Table.HeaderCell scope="col">Periode</Table.HeaderCell>
            <Table.HeaderCell scope="col">Ordning</Table.HeaderCell>
            <Table.HeaderCell scope="col">Ytelse</Table.HeaderCell>
          </Table.Row>
        </Table.Header>
        <Table.Body>
          {grunnlag.tjenestepensjonYtelser.map((tjenestepensjonYtelse, index) => {
            return (
              <Table.Row key={index}>
                <Table.DataCell textSize={'small'}>
                  {formaterPeriode(tjenestepensjonYtelse.ytelseIverksattFom, tjenestepensjonYtelse.ytelseIverksattTom)}
                </Table.DataCell>
                <Table.DataCell textSize={'small'}>{tjenestepensjonYtelse.ordning.navn}</Table.DataCell>
                <Table.DataCell textSize={'small'}>{tjenestepensjonYtelse.ytelse}</Table.DataCell>
              </Table.Row>
            );
          })}
        </Table.Body>
      </TableStyled>

      <FormField form={form} formField={formFields.begrunnelse} />
      <FormField form={form} formField={formFields.skalEtterbetalingHoldesIgjen} horizontalRadio />
    </VilkårskortMedFormOgMellomlagring>
  );
};

function mapVurderingToDraftFormFields(
  vurdering: SamordningTjenestePensjonGrunnlag['tjenestepensjonRefusjonskravVurdering']
): DraftFormFields {
  return {
    begrunnelse: vurdering?.begrunnelse,
    skalEtterbetalingHoldesIgjen: getJaNeiEllerUndefined(vurdering?.harKrav),
  };
}

function emptyDraftFormFields(): DraftFormFields {
  return {
    begrunnelse: '',
    skalEtterbetalingHoldesIgjen: undefined,
  };
}
