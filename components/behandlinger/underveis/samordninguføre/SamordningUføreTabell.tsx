'use client';

import { Label, Table } from '@navikt/ds-react';
import styles from 'components/behandlinger/underveis/samordninggradering/YtelseTabell.module.css';
import { TextFieldWrapper } from 'components/form/textfieldwrapper/TextFieldWrapper';
import { useFieldArray, UseFormReturn } from 'react-hook-form';
import { SamordningUføreFormFields } from 'components/behandlinger/underveis/samordninguføre/SamordningUføre';
import { formaterDatoForVisning } from '@navikt/aap-felles-utils-client';

interface Props {
  form: UseFormReturn<SamordningUføreFormFields>;
  readOnly: boolean;
}
export const SamordningUføreTabell = ({ form, readOnly }: Props) => {
  const { fields } = useFieldArray({ name: 'vurderteSamordninger', control: form.control });
  return (
    <div>
      <Label size={'small'}>Vurder brukers faktiske uføregrad</Label>
      <Table>
        <Table.Header>
          <Table.Row>
            <Table.HeaderCell>Kilde</Table.HeaderCell>
            <Table.HeaderCell>Periode</Table.HeaderCell>
            <Table.HeaderCell>Grad fra kilde</Table.HeaderCell>
            <Table.HeaderCell>Uføregrad til samordning (%)</Table.HeaderCell>
          </Table.Row>
        </Table.Header>
        <Table.Body>
          {fields.map((field, index) => (
            <Table.Row key={field.id}>
              <Table.DataCell>{field.kilde}</Table.DataCell>
              <Table.DataCell>{formaterDatoForVisning(field.virkningstidspunkt)}</Table.DataCell>
              <Table.DataCell>{field.graderingFraKilde}</Table.DataCell>
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
                    required: 'Du må velge utbetalingsgrad',
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
            </Table.Row>
          ))}
        </Table.Body>
      </Table>
    </div>
  );
};
