'use client';

import { VilkårskortMedFormOgMellomlagringNyVisning } from 'components/vilkårskort/vilkårskortmedformogmellomlagringnyvisning/VilkårskortMedFormOgMellomlagringNyVisning';
import { MellomlagretVurdering, Periode } from 'lib/types/types';
import { useConfigForm } from 'components/form/FormHook';
import { FormField } from 'components/form/FormField';
import { useFieldArray } from 'react-hook-form';
import { useLøsBehovOgGåTilNesteSteg } from 'hooks/saksbehandling/LøsBehovOgGåTilNesteStegHook';
import { useVilkårskortVisning } from 'hooks/saksbehandling/visning/VisningHook';
import { useMellomlagring } from 'hooks/saksbehandling/MellomlagringHook';
import { Behovstype } from 'lib/utils/form';
import { BodyLong, Button, HStack, Label, Table, VStack } from '@navikt/ds-react';
import { TableStyled } from 'components/tablestyled/TableStyled';
import { PlusCircleIcon, TrashIcon } from '@navikt/aksel-icons';
import { MonthPickerWrapper } from 'components/form/monthpickerwrapper/MonthPickerWrapper';
import { TextFieldWrapper } from 'components/form/textfieldwrapper/TextFieldWrapper';

interface Props {
  behandlingVersjon: number;
  readOnly: boolean;
  initialMellomlagretVurdering?: MellomlagretVurdering;
}

interface Barnepensjon {
  periode: Periode;
  månedsytelse: string;
}

interface FormFields {
  begrunnelse: string;
  barnepensjon: Barnepensjon[];
}

export const Barnepensjon = ({ readOnly, initialMellomlagretVurdering }: Props) => {
  const { mellomlagretVurdering, lagreMellomlagring, nullstillMellomlagretVurdering, slettMellomlagring } =
    useMellomlagring(Behovstype.AVKLAR_SAMORDNING_BARNEPENSJON_KODE);
  const { status, løsBehovOgGåTilNesteStegError, isLoading } = useLøsBehovOgGåTilNesteSteg('SAMORDNING_BARNEPENSJON');
  const { visningModus, visningActions, formReadOnly } = useVilkårskortVisning(
    readOnly,
    'SAMORDNING_BARNEPENSJON',
    initialMellomlagretVurdering
  );

  const { form, formFields } = useConfigForm<FormFields>(
    {
      begrunnelse: {
        type: 'textarea',
        label: 'Vurder samordning med barnepensjon',
        rules: { required: 'Du må vurdere samordning med barnepensjon.' },
      },
      barnepensjon: {
        type: 'fieldArray',
      },
    },
    { readOnly: formReadOnly }
  );

  const { fields, remove, append } = useFieldArray({ control: form.control, name: 'barnepensjon' });

  return (
    <VilkårskortMedFormOgMellomlagringNyVisning
      heading={'§ 11-27 Samordning barnepensjon (valgfritt)'}
      steg={'SAMORDNING_BARNEPENSJON'}
      onSubmit={form.handleSubmit((data) => {
        console.log(data);
        nullstillMellomlagretVurdering();
      })}
      isLoading={isLoading}
      status={status}
      løsBehovOgGåTilNesteStegError={løsBehovOgGåTilNesteStegError}
      vilkårTilhørerNavKontor={false}
      visningModus={visningModus}
      visningActions={visningActions}
      onDeleteMellomlagringClick={() => slettMellomlagring(() => form.reset())}
      onLagreMellomLagringClick={() => lagreMellomlagring(form.watch())}
      mellomlagretVurdering={mellomlagretVurdering}
      formReset={() => form.reset()}
    >
      <VStack gap={'8'}>
        <FormField form={form} formField={formFields.begrunnelse} />

        <VStack gap={'space-8'}>
          <Label size={'small'}>Legg til periode med samordning av barnepensjon</Label>
          <BodyLong size={'small'}>Legg til perioder med barnepensjon som skal samordnes med AAP.</BodyLong>
          <TableStyled size={'small'}>
            <Table.Header>
              <Table.Row>
                <Table.HeaderCell>Ytelse</Table.HeaderCell>
                <Table.HeaderCell>Periode</Table.HeaderCell>
                <Table.HeaderCell></Table.HeaderCell>
                <Table.HeaderCell>Månedsytelse</Table.HeaderCell>
                <Table.HeaderCell>Dagsats</Table.HeaderCell>
                <Table.HeaderCell></Table.HeaderCell>
              </Table.Row>
            </Table.Header>
            <Table.Body>
              {fields.map((field, index) => {
                return (
                  <Table.Row key={field.id}>
                    <Table.DataCell textSize={'small'}>Barnepensjon</Table.DataCell>
                    <Table.DataCell>
                      <HStack gap={'2'} align={'center'}>
                        <MonthPickerWrapper
                          name={`barnepensjon.${index}.periode.fom`}
                          control={form.control}
                          form={form}
                          size={'small'}
                          hideLabel={true}
                          label={'Fra og med dato for barnepensjon'}
                        />
                        <div>-</div>
                        <MonthPickerWrapper
                          name={`barnepensjon.${index}.periode.tom`}
                          control={form.control}
                          form={form}
                          size={'small'}
                          hideLabel={true}
                          label={'Til og med dato for barnepensjon'}
                        />
                      </HStack>
                    </Table.DataCell>
                    <Table.DataCell></Table.DataCell>
                    <Table.DataCell>
                      <TextFieldWrapper
                        control={form.control}
                        name={`barnepensjon.${index}.månedsytelse`}
                        label={'Hvilken månedsytelse'}
                        hideLabel
                        type={'number'}
                      />
                    </Table.DataCell>
                    <Table.DataCell>Dagsats</Table.DataCell>
                    <Table.DataCell>
                      <Button
                        variant={'tertiary'}
                        type={'button'}
                        icon={<TrashIcon fontSize={'1.5rem'} />}
                        onClick={() => remove(index)}
                      />
                    </Table.DataCell>
                  </Table.Row>
                );
              })}
            </Table.Body>
          </TableStyled>
          <div>
            <Button
              onClick={() =>
                append({
                  periode: { fom: '', tom: '' },
                  månedsytelse: '',
                })
              }
              variant={'tertiary'}
              type={'button'}
              icon={<PlusCircleIcon />}
              size={'small'}
            >
              Legg til
            </Button>
          </div>
        </VStack>
      </VStack>
    </VilkårskortMedFormOgMellomlagringNyVisning>
  );
};
