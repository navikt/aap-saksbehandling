import { BodyLong, Button, HStack, Label, Table, VStack } from '@navikt/ds-react';
import { TableStyled } from 'components/tablestyled/TableStyled';
import { MonthPickerWrapper } from 'components/form/monthpickerwrapper/MonthPickerWrapper';
import { TextFieldWrapper } from 'components/form/textfieldwrapper/TextFieldWrapper';
import { useFieldArray, UseFormReturn } from 'react-hook-form';
import { PlusCircleIcon, TrashIcon } from '@navikt/aksel-icons';
import { BarnePensjonFormFields } from 'components/behandlinger/samordning/barnepensjon/Barnepensjon';
import { formaterTilNok } from 'lib/utils/string';

import styles from './Barnepensjon.module.css';

interface Props {
  form: UseFormReturn<BarnePensjonFormFields>;
  readOnly: boolean;
}

export const BarnepensjonTabell = ({ form, readOnly }: Props) => {
  const { fields, remove, append } = useFieldArray({ control: form.control, name: 'barnepensjon' });

  return (
    <VStack gap={'space-8'}>
      <Label size={'small'}>Legg til periode med samordning av barnepensjon</Label>
      <BodyLong size={'small'}>Legg til perioder med barnepensjon som skal samordnes med AAP.</BodyLong>
      <TableStyled tablelayout={'FIXED'}>
        <Table.Header>
          <Table.Row>
            <Table.HeaderCell textSize={'small'}>Ytelse</Table.HeaderCell>
            <Table.HeaderCell colSpan={3}>Periode</Table.HeaderCell>
            <Table.HeaderCell textSize={'small'}>Månedsytelse</Table.HeaderCell>
            <Table.HeaderCell textSize={'small'}>Dagsats</Table.HeaderCell>
            <Table.HeaderCell textSize={'small'}></Table.HeaderCell>
          </Table.Row>
        </Table.Header>
        <Table.Body>
          {fields.map((field, index) => {
            const månedsytelse = form.watch(`barnepensjon.${index}.månedsytelse`);
            const dagSats = formaterTilNok((Number(månedsytelse) * 12) / 260);

            return (
              <Table.Row key={field.id}>
                <Table.DataCell textSize={'small'}>Barnepensjon</Table.DataCell>
                <Table.DataCell colSpan={3}>
                  <HStack gap={'2'}>
                    <MonthPickerWrapper
                      name={`barnepensjon.${index}.periode.fom`}
                      control={form.control}
                      form={form}
                      size={'small'}
                      hideLabel={true}
                      label={'Fra og med dato for barnepensjon'}
                      readOnly={readOnly}
                      rules={{ required: 'Du må sette en fra og med dato' }}
                    />
                    <span>-</span>
                    <MonthPickerWrapper
                      name={`barnepensjon.${index}.periode.tom`}
                      control={form.control}
                      form={form}
                      size={'small'}
                      hideLabel={true}
                      label={'Til og med dato for barnepensjon'}
                      readOnly={readOnly}
                      rules={{ required: 'Du må sette en til og med dato' }}
                    />
                  </HStack>
                </Table.DataCell>

                <Table.DataCell>
                  <TextFieldWrapper
                    control={form.control}
                    name={`barnepensjon.${index}.månedsytelse`}
                    label={'Hvilken månedsytelse'}
                    hideLabel
                    type={'number'}
                    readOnly={readOnly}
                    className={styles.månedytelseTextField}
                    rules={{ required: 'Du må fylle ut månedsytelsen' }}
                  />
                </Table.DataCell>
                <Table.DataCell>{dagSats}</Table.DataCell>
                <Table.DataCell>
                  {!readOnly && (
                    <Button
                      variant={'tertiary'}
                      type={'button'}
                      icon={<TrashIcon title={'Fjern periode'} fontSize={'1.5rem'} />}
                      onClick={() => remove(index)}
                    />
                  )}
                </Table.DataCell>
              </Table.Row>
            );
          })}
        </Table.Body>
      </TableStyled>
      {!readOnly && (
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
      )}{' '}
    </VStack>
  );
};
