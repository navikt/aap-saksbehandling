import { Table, VStack } from '@navikt/ds-react';
import { format } from 'date-fns';
import { useFieldArray, UseFormReturn } from 'react-hook-form';
import styles from './MeldePeriodeInput.module.css';
import {
  Meldedag,
  MeldekortFormFields,
} from 'components/postmottak/digitaliserdokument/meldekort/DigitaliserMeldekortV2';
import { TextFieldWrapper } from 'components/form/textfieldwrapper/TextFieldWrapper';

interface Props {
  form: UseFormReturn<MeldekortFormFields>;
  dagIndex: number;
  readOnly: boolean;
}
export const MeldePeriodeInputV2 = ({ form, dagIndex, readOnly }: Props) => {
  const { fields } = useFieldArray({
    name: `meldeperioder.${dagIndex}.dager`,
    control: form.control,
  });

  return (
    <VStack padding={'4'} className={styles.pliktPeriodeInput}>
      <Table size={'small'} className={styles.tabell}>
        <Table.Header>
          <Table.Row>
            <Table.HeaderCell></Table.HeaderCell>
            {fields?.map((meldedag: Meldedag, j) => (
              <Table.HeaderCell key={j}>{format(meldedag.dato, 'dd.MM.')}</Table.HeaderCell>
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
