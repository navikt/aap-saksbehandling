import { Table, VStack } from '@navikt/ds-react';
import { format } from 'date-fns';
import { UseFormReturn, useFieldArray } from 'react-hook-form';

import { TextFieldWrapper } from 'components/form/textfieldwrapper/TextFieldWrapper';
import { MeldekortFormFields } from 'components/postmottak/digitaliserdokument/meldekort/DigitaliserMeldekort';

import styles from './MeldePeriodeInput.module.css';

interface Props {
  form: UseFormReturn<MeldekortFormFields>;
  dagIndex: number;
  readOnly: boolean;
}
export const MeldePeriodeInput = ({ form, dagIndex, readOnly }: Props) => {
  const { fields } = useFieldArray({
    name: `meldeperioder.${dagIndex}.dager`,
    control: form.control,
  });

  return (
    <VStack padding={'space-16'} className={styles.pliktPeriodeInput}>
      <Table size={'small'} className={styles.tabell}>
        <Table.Header>
          <Table.Row>
            <Table.HeaderCell></Table.HeaderCell>
            {fields?.map((meldedag, index) => (
              <Table.HeaderCell key={index}>{format(meldedag.dato, 'dd.MM.')}</Table.HeaderCell>
            ))}
          </Table.Row>
        </Table.Header>
        <Table.Body>
          <Table.Row>
            <Table.DataCell>Arbeidstimer</Table.DataCell>
            {fields?.map((meldedag, i) => (
              <Table.DataCell key={i}>
                <TextFieldWrapper
                  key={meldedag.id}
                  control={form.control}
                  name={`meldeperioder.${dagIndex}.dager.${i}.arbeidsTimer`}
                  label="Arbeidstimer"
                  type="number"
                  size="small"
                  readOnly={readOnly}
                />
              </Table.DataCell>
            ))}
          </Table.Row>
        </Table.Body>
      </Table>
    </VStack>
  );
};
