'use client';

import { Button, HStack, Label, Table, VStack } from '@navikt/ds-react';
import styles from 'components/behandlinger/samordning/samordninggradering/YtelseTabell.module.css';
import { TextFieldWrapper } from 'components/form/textfieldwrapper/TextFieldWrapper';
import { useFieldArray, UseFormReturn } from 'react-hook-form';
import { SamordningUføreFormFields } from 'components/behandlinger/samordning/samordninguføre/SamordningUføre';
import { PlusCircleIcon, TrashIcon } from '@navikt/aksel-icons';
import { DateInputWrapper } from 'components/form/dateinputwrapper/DateInputWrapper';
import { TableStyled } from 'components/tablestyled/TableStyled';

interface Props {
  form: UseFormReturn<SamordningUføreFormFields>;
  readOnly: boolean;
}
export const SamordningUføreTabell = ({ form, readOnly }: Props) => {
  const { fields, append, remove } = useFieldArray({ name: 'vurderteSamordninger', control: form.control });
  function leggTilRad() {
    append({
      gradering: undefined,
      virkningstidspunkt: '',
    });
  }
  return (
    <VStack gap={'1'}>
      <Label size={'small'}>Vurder brukers faktiske uføregrad</Label>
      <TableStyled>
        <Table.Header>
          <Table.Row>
            <Table.HeaderCell>Virkningstidspunkt</Table.HeaderCell>
            <Table.HeaderCell>Uføregrad til samordning (%)</Table.HeaderCell>
            <Table.HeaderCell></Table.HeaderCell>
          </Table.Row>
        </Table.Header>
        <Table.Body>
          {fields.map((field, index) => (
            <Table.Row key={field.id}>
              <Table.DataCell>
                <DateInputWrapper name={`vurderteSamordninger.${index}.virkningstidspunkt`} control={form.control} />
              </Table.DataCell>
              <Table.DataCell>
                <TextFieldWrapper
                  name={`vurderteSamordninger.${index}.gradering`}
                  label={'Utbetalingsgrad'}
                  hideLabel
                  type={'text'}
                  size={'small'}
                  control={form.control}
                  readOnly={readOnly}
                  rules={{
                    required: 'Du må angi uføregrad',
                    validate: (value) => {
                      if (Number.isNaN(Number(value))) {
                        return 'Prosent må angis med siffer';
                      }
                      if (Number(value) < 0) {
                        return 'Utbetalingsgrad kan ikke være mindre enn 0%';
                      }
                      if (Number(value) > 100) {
                        return 'Utbetalingsgrad kan ikke være mer enn 100%';
                      }
                    },
                  }}
                  className={styles.utbetalingsgrad}
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
                />
              </Table.DataCell>
            </Table.Row>
          ))}
        </Table.Body>
      </TableStyled>
      <HStack>
        <Button
          size={'small'}
          type={'button'}
          variant={'tertiary'}
          icon={<PlusCircleIcon />}
          onClick={leggTilRad}
          disabled={readOnly}
        >
          Legg til
        </Button>
      </HStack>
    </VStack>
  );
};
