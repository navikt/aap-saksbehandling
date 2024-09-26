import { Button, Heading, Table } from '@navikt/ds-react';

import styles from 'components/behandlinger/sykdom/fastsettarbeidsevne/fastsettarbeidsevneperiodetabell/FastsettArbeidsevnePeriodeTable.module.css';
import { FastsettArbeidsevneFormFields } from 'components/behandlinger/sykdom/fastsettarbeidsevne/FastsettArbeidsevne';
import { FieldArrayWithId, UseFormReturn } from 'react-hook-form';
import { SelectWrapper, TextFieldWrapper } from '@navikt/aap-felles-react';

interface Props {
  fields: FieldArrayWithId<FastsettArbeidsevneFormFields, 'perioder'>[];
  form: UseFormReturn<FastsettArbeidsevneFormFields>;
  readOnly: boolean;
  remove: (index: number) => void;
}

export const FastsettArbeidsevnePeriodetabell = ({ fields, form, readOnly, remove }: Props) => {
  return (
    <div className={styles.tabell}>
      <Heading size={'small'} level={'4'}>
        Registrerte perioder med arbeidsevne
      </Heading>
      <Table>
        <Table.Header>
          <Table.Row>
            <Table.HeaderCell>Arbeidsevne</Table.HeaderCell>
            <Table.HeaderCell>Enhet</Table.HeaderCell>
            <Table.HeaderCell>Maks ytelse</Table.HeaderCell>
            <Table.HeaderCell>Gjelder fra</Table.HeaderCell>
            <Table.HeaderCell>Til og med (valgfritt)</Table.HeaderCell>
            <Table.HeaderCell>Dato vurdert</Table.HeaderCell>
            <Table.HeaderCell>Handling</Table.HeaderCell>
          </Table.Row>
        </Table.Header>
        <Table.Body>
          {fields.map((field, index) => (
            <Table.Row key={field.id}>
              <Table.DataCell>
                <TextFieldWrapper
                  type={'text'}
                  label={'Arbeidsevne'}
                  hideLabel
                  control={form.control}
                  name={`perioder.${index}.arbeidsevne`}
                  readOnly={readOnly}
                  rules={{
                    required: 'Du må registrere hvor stor arbeidsevnen er',
                  }}
                />
              </Table.DataCell>
              <Table.DataCell>
                <SelectWrapper
                  name={`perioder.${index}.enhet`}
                  control={form.control}
                  hideLabel
                  label={'Enhet'}
                  rules={{ required: 'Du må velge om arbeidsevnen er i timer eller prosent' }}
                  readOnly={readOnly}
                >
                  <option></option>
                  <option value={'PROSENT'}>Prosent</option>
                  <option value={'TIMER'}>Timer</option>
                </SelectWrapper>
              </Table.DataCell>
              <Table.DataCell></Table.DataCell>
              <Table.DataCell>
                <TextFieldWrapper
                  type={'text'}
                  label={'Gjelder fra'}
                  hideLabel
                  control={form.control}
                  name={`perioder.${index}.fom`}
                  readOnly={readOnly}
                  rules={{
                    required: 'Du må legge inn en dato for når perioden starter',
                  }}
                />
              </Table.DataCell>
              <Table.DataCell>
                <TextFieldWrapper
                  type={'text'}
                  label={'Til og med (valgfritt)'}
                  hideLabel
                  control={form.control}
                  name={`perioder.${index}.tom`}
                  readOnly={readOnly}
                />
              </Table.DataCell>
              <Table.DataCell></Table.DataCell>
              <Table.DataCell>
                {fields.length > 1 && (
                  <Button variant={'tertiary'} type={'button'} onClick={() => remove(index)}>
                    Slett
                  </Button>
                )}
              </Table.DataCell>
            </Table.Row>
          ))}
        </Table.Body>
      </Table>
    </div>
  );
};
