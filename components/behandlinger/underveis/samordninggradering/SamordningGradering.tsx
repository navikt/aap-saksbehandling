'use client';

import { PlusCircleIcon, TrashIcon } from '@navikt/aksel-icons';
import { VilkårsKort } from 'components/vilkårskort/VilkårsKort';
import { Periode, SamordningGraderingGrunnlag } from 'lib/types/types';
import { Form } from 'components/form/Form';
import { useLøsBehovOgGåTilNesteSteg } from 'hooks/LøsBehovOgGåTilNesteStegHook';
import { Button, Detail, ExpansionCard, HStack, Select, Table, VStack } from '@navikt/ds-react';
import { useFieldArray } from 'react-hook-form';
import { FormEvent, useState } from 'react';
import { useConfigForm } from 'components/form/FormHook';
import { FormField, ValuePair } from 'components/form/FormField';
import { useBehandlingsReferanse } from 'hooks/BehandlingHook';
import { Behovstype } from 'lib/utils/form';
import { TextFieldWrapper } from 'components/form/textfieldwrapper/TextFieldWrapper';

interface Props {
  grunnlag: SamordningGraderingGrunnlag;
  behandlingVersjon: number;
  readOnly: boolean;
}

type SamordnetYtelse = {
  ytelseType: string; // TODO nei, enum
  gradering?: number;
  kronseum?: number;
  periode: Periode;
};

interface Formfields {
  begrunnelse: string;
  maksDatoEndelig: string;
  maksDato?: string;
  vurderteSamordninger: SamordnetYtelse[];
}

const ytelsesoptions: ValuePair[] = [
  { value: '', label: 'Velg ytelse' },
  {
    value: 'SYKEPENGER',
    label: 'Sykepenger',
  },
  {
    value: 'FORELDREPENGER',
    label: 'Foreldrepenger',
  },
  {
    value: 'PLEIEPENGER',
    label: 'Pleiepenger',
  },
  {
    value: 'SVANGERSKAPSPENGER',
    label: 'Svangerskapspenger',
  },
  {
    value: 'OMSORGSPENGER',
    label: 'Omsorgspenger',
  },
  {
    value: 'OPPLÆRINGSPENGER',
    label: 'Opplæringspenger',
  },
];

export const SamordningGradering = ({ grunnlag, behandlingVersjon, readOnly }: Props) => {
  const behandlingsreferanse = useBehandlingsReferanse();
  const [visForm, setVisForm] = useState<boolean>(false);
  const { form, formFields } = useConfigForm<Formfields>(
    {
      begrunnelse: {
        type: 'textarea',
        label: 'Vurder utbetalingsgrad for folketrygdytelser',
      },
      maksDatoEndelig: {
        type: 'radio',
        label: 'Skal virkningstidspunkt revurderes nærmere?',
        options: [
          { label: 'Ja, virkningstidspunkt må vurderes på nytt', value: 'false' },
          { label: 'Nei, virkningstidspunkt er bekreftet', value: 'true' },
        ],
      },
      maksDato: {
        type: 'date_input',
        label: 'Sett dato for ny revurdering',
      },
      vurderteSamordninger: {
        type: 'fieldArray',
        defaultValue: [],
      },
    },
    { readOnly }
  );
  const { løsBehovOgGåTilNesteSteg, status, isLoading, resetStatus } =
    useLøsBehovOgGåTilNesteSteg('SAMORDNING_GRADERING');

  const { fields, append, remove, update } = useFieldArray({
    control: form.control,
    name: 'vurderteSamordninger',
  });

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    form.handleSubmit(async () =>
      løsBehovOgGåTilNesteSteg({
        behandlingVersjon: behandlingVersjon,
        behov: {
          behovstype: Behovstype.AVKLAR_SAMORDNING_GRADERING,
        },
        referanse: behandlingsreferanse,
      })
    )(event);
  };

  function leggTilRad() {
    append({ ytelseType: '', periode: { fom: '', tom: '' }, gradering: undefined });
  }

  return (
    <VilkårsKort heading="§§ 11-27 / 11-28 Samordning med andre folketrygdytelser" steg="SAMORDNING_GRADERING">
      {visForm && (
        <>
          <Form
            steg={'SAMORDNING_GRADERING'}
            onSubmit={handleSubmit}
            isLoading={isLoading}
            status={status}
            resetStatus={resetStatus}
          >
            <FormField form={form} formField={formFields.begrunnelse} />
            <Table>
              <Table.Header>
                <Table.Row>
                  <Table.HeaderCell>Ytelse</Table.HeaderCell>
                  <Table.HeaderCell>Periode</Table.HeaderCell>
                  <Table.HeaderCell>Kilde</Table.HeaderCell>
                  <Table.HeaderCell>Grad fra kilde</Table.HeaderCell>
                  <Table.HeaderCell>Utbetalingsgrad</Table.HeaderCell>
                  <Table.HeaderCell></Table.HeaderCell>
                </Table.Row>
              </Table.Header>
              <Table.Body>
                {fields.map((field, index) => (
                  <Table.Row key={field.id}>
                    <Table.DataCell>
                      <Select
                        label="Ytelsestype"
                        size={'small'}
                        hideLabel
                        onChange={(event) => update(index, { ...field, ytelseType: event.target.value })}
                        value={field.ytelseType}
                      >
                        {ytelsesoptions.map((ytelse) => (
                          <option value={ytelse.value} key={ytelse.value}>
                            {ytelse.label}
                          </option>
                        ))}
                      </Select>
                    </Table.DataCell>
                    <Table.DataCell></Table.DataCell>
                    <Table.DataCell>Manuell</Table.DataCell>
                    <Table.DataCell>-</Table.DataCell>
                    <Table.DataCell>
                      <TextFieldWrapper
                        name={`vurderteSamordninger.${index}.gradering`}
                        label={'Gradering'}
                        hideLabel
                        type={'text'}
                        size={'small'}
                        control={form.control}
                        readOnly={readOnly}
                      />
                    </Table.DataCell>
                    <Table.DataCell>
                      <Button
                        size={'small'}
                        icon={<TrashIcon title={'Slett'} />}
                        variant={'tertiary'}
                        type={'button'}
                        onClick={() => remove(index)}
                        disabled={readOnly}
                      ></Button>
                    </Table.DataCell>
                  </Table.Row>
                ))}
              </Table.Body>
            </Table>
            <HStack>
              <Button
                size={'small'}
                type={'button'}
                variant={'secondary'}
                icon={<PlusCircleIcon />}
                onClick={leggTilRad}
              >
                Legg til
              </Button>
            </HStack>
            <ExpansionCard aria-label="Tidligste virkningstidspunkt etter samordning er" open>
              <ExpansionCard.Header>Tidligste virkningstidspunkt etter samordning er</ExpansionCard.Header>
              <ExpansionCard.Content>
                <FormField form={form} formField={formFields.maksDatoEndelig} />
                {form.watch('maksDatoEndelig') === 'false' && <FormField form={form} formField={formFields.maksDato} />}
              </ExpansionCard.Content>
            </ExpansionCard>
          </Form>
        </>
      )}
      {!visForm && grunnlag.ytelser.length === 0 && grunnlag.vurderinger.length === 0 && (
        <VStack gap={'2'}>
          <Detail>Vi finner ingen ytelser fra folketrygden</Detail>
          <HStack>
            <Button size={'small'} type={'button'} variant={'secondary'} onClick={() => setVisForm(true)}>
              Legg til folketrygdytelse
            </Button>
          </HStack>
        </VStack>
      )}
    </VilkårsKort>
  );
};
