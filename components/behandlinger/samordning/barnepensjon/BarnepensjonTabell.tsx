import { BodyLong, Button, HStack, Label, Table, VStack } from '@navikt/ds-react';
import { TableStyled } from 'components/tablestyled/TableStyled';
import { MonthPickerWrapper } from 'components/form/monthpickerwrapper/MonthPickerWrapper';
import { TextFieldWrapper } from 'components/form/textfieldwrapper/TextFieldWrapper';
import { useFieldArray, UseFormReturn } from 'react-hook-form';
import { PlusCircleIcon, TrashIcon } from '@navikt/aksel-icons';
import { BarnepensjonFormFields } from 'components/behandlinger/samordning/barnepensjon/Barnepensjon';
import { formaterTilNok } from 'lib/utils/string';

import styles from './Barnepensjon.module.css';
import { isBefore } from 'date-fns';

interface Props {
  form: UseFormReturn<BarnepensjonFormFields>;
  readOnly: boolean;
}

export const BarnepensjonTabell = ({ form, readOnly }: Props) => {
  const { fields, remove, append } = useFieldArray({ control: form.control, name: 'barnepensjonPerioder' });

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
            const månedsytelse = form.watch(`barnepensjonPerioder.${index}.månedsbeløp`);
            const dagSats = beregnDagsats(månedsytelse);

            const errorForRad = form.formState.errors.barnepensjonPerioder?.[index];

            return (
              <Table.Row key={field.id}>
                <Table.DataCell textSize={'small'}>Barnepensjon</Table.DataCell>
                <Table.DataCell colSpan={3}>
                  <HStack gap={"space-8"}>
                    <MonthPickerWrapper
                      name={`barnepensjonPerioder.${index}.fom`}
                      control={form.control}
                      form={form}
                      size={'small'}
                      hideLabel={true}
                      label={'Fra og med dato for barnepensjon'}
                      readOnly={readOnly}
                      rules={{ required: 'Du må sette en fra og med dato' }}
                      className={errorForRad?.fom ? 'navds-date__field--error' : ''}
                      hideErrorMessage={true}
                    />
                    <span>-</span>
                    <MonthPickerWrapper
                      name={`barnepensjonPerioder.${index}.tom`}
                      control={form.control}
                      form={form}
                      size={'small'}
                      hideLabel
                      label={'Til og med dato for barnepensjon'}
                      readOnly={readOnly}
                      className={errorForRad?.tom && 'navds-date__field--error'}
                      hideErrorMessage
                      rules={{
                        required: 'Du må sette en til og med dato.',
                        validate: {
                          validerKronologiskRekkefølge: (value, formValues) => {
                            const fraOgMedDato = formValues.barnepensjonPerioder[index].fom;
                            const tilOgMedDato = value as string;

                            if (isBefore(new Date(tilOgMedDato), new Date(fraOgMedDato))) {
                              return 'Til og med dato kan ikke være før fra og med dato';
                            }
                          },
                        },
                      }}
                    />
                  </HStack>
                </Table.DataCell>
                <Table.DataCell>
                  <TextFieldWrapper
                    control={form.control}
                    name={`barnepensjonPerioder.${index}.månedsbeløp`}
                    label={'Hvilken månedsytelse'}
                    hideLabel
                    hideErrorMessage
                    type={'number'}
                    readOnly={readOnly}
                    className={`${styles.månedytelseTextField} ${errorForRad?.månedsbeløp && 'navds-text-field--error'}`}
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
                fom: '',
                tom: '',
                månedsbeløp: '',
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

export function beregnDagsats(månedsytelse: string) {
  const dagSats = Math.ceil((Number(månedsytelse) * 12) / 260);
  return formaterTilNok(dagSats);
}
