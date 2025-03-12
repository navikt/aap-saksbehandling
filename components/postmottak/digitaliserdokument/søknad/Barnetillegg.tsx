import { Button, HStack, Label, Table, VStack } from '@navikt/ds-react';
import { useFieldArray, UseFormReturn } from 'react-hook-form';
import { SøknadFormFields } from './DigitaliserSøknad';
import { TrashIcon } from '@navikt/aksel-icons';
import { TextFieldWrapper } from 'components/form/textfieldwrapper/TextFieldWrapper';
import { SelectWrapper } from 'components/form/selectwrapper/SelectWrapper';

interface Props {
  form: UseFormReturn<SøknadFormFields>;
  readOnly: boolean;
}
export const Barnetillegg = ({ form, readOnly }: Props) => {
  const { fields, append, remove } = useFieldArray({ control: form.control, name: 'oppgitteBarn' });
  return (
    <VStack gap={'3'}>
      <Label size={'small'}>Barnetillegg</Label>
      {fields.length > 0 && (
        <Table size="small">
          <Table.Header>
            <Table.Row>
              <Table.HeaderCell textSize={'small'} scope="col">
                Fødselsnr.
              </Table.HeaderCell>
              <Table.HeaderCell textSize={'small'} scope="col">
                Fornavn
              </Table.HeaderCell>
              <Table.HeaderCell textSize={'small'} scope="col">
                Etternavn
              </Table.HeaderCell>
              <Table.HeaderCell textSize={'small'} scope="col">
                Relasjon
              </Table.HeaderCell>
              <Table.HeaderCell textSize={'small'} scope="col"></Table.HeaderCell>
            </Table.Row>
          </Table.Header>
          <Table.Body>
            {fields.map(({ fnr }, i) => {
              return (
                <Table.Row key={`${i}-${fnr}`}>
                  <Table.DataCell>
                    <TextFieldWrapper
                      label={'Fødselsnummer'}
                      hideLabel={true}
                      type={'text'}
                      name={`oppgitteBarn.${i}.fnr`}
                      control={form.control}
                      rules={{
                        required:
                          'Fødselsnummer er påkrevd. Sett postoppgaven på vent og innhent fødselsnummer hvis dette mangler.',
                      }}
                      readOnly={readOnly}
                    ></TextFieldWrapper>
                  </Table.DataCell>
                  <Table.DataCell>
                    <TextFieldWrapper
                      label={'Fornavn'}
                      hideLabel={true}
                      type={'text'}
                      name={`oppgitteBarn.${i}.fornavn`}
                      control={form.control}
                      readOnly={readOnly}
                    />
                  </Table.DataCell>
                  <Table.DataCell>
                    <TextFieldWrapper
                      label={'Etternavn'}
                      hideLabel={true}
                      type={'text'}
                      name={`oppgitteBarn.${i}.etternavn`}
                      control={form.control}
                      readOnly={readOnly}
                    />
                  </Table.DataCell>
                  <Table.DataCell>
                    <SelectWrapper
                      label={'Relasjon'}
                      hideLabel={true}
                      name={`oppgitteBarn.${i}.relasjon`}
                      control={form.control}
                      readOnly={readOnly}
                    >
                      <option value={'FORELDER'}>Forelder</option>
                      <option value={'FOSTERFORELDER'}>Fosterforelder</option>
                    </SelectWrapper>
                  </Table.DataCell>
                  <Table.DataCell>
                    <Button
                      aria-label={'Slett'}
                      size={'small'}
                      icon={<TrashIcon title={'Slett'} />}
                      variant={'secondary-neutral'}
                      type={'button'}
                      onClick={() => remove(i)}
                      disabled={readOnly}
                    />
                  </Table.DataCell>
                </Table.Row>
              );
            })}
          </Table.Body>
        </Table>
      )}
      <HStack>
        <Button variant={'secondary'} disabled={readOnly} size={'small'} type={'button'} onClick={() => append({})}>
          Legg til
        </Button>
      </HStack>
    </VStack>
  );
};
