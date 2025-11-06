'use client';

import { useFieldArray, UseFormReturn } from 'react-hook-form';
import { SamordningAndreStatligeYtelserFormFields } from 'components/behandlinger/samordning/samordningandrestatlige/SamordningAndreStatligeYtelser';
import { BodyLong, Button, HStack, Label, Table, VStack } from '@navikt/ds-react';
import { PlusCircleIcon, TrashIcon } from '@navikt/aksel-icons';
import { SelectWrapper } from 'components/form/selectwrapper/SelectWrapper';
import { DateInputWrapper } from 'components/form/dateinputwrapper/DateInputWrapper';
import { validerDato } from 'lib/validation/dateValidation';
import { ValuePair } from 'components/form/FormField';
import { SamordningAndreStatligeYtelserYtelse } from 'lib/types/types';
import { TableStyled } from 'components/tablestyled/TableStyled';
import { TextFieldWrapper } from 'components/form/textfieldwrapper/TextFieldWrapper';
import styles from 'components/behandlinger/samordning/samordninggradering/YtelseTabell.module.css';
import { SamordningArbeidsgiverFormFields } from 'components/behandlinger/samordning/samordningArbeidsgiver/SamordningArbeidsgiver';

interface Props {
  form: UseFormReturn<SamordningArbeidsgiverFormFields>;
  readOnly: boolean;
}

export const SamordningArbeidsGiverTabell = ({ form, readOnly }: Props) => {
  const { fields, append, remove } = useFieldArray({ name: 'vurderteSamordninger', control: form.control });
  function leggTilRad() {
    append({
      ytelse: undefined,
      fom: '',
      tom: '',
    });
  }
  return (
    <VStack gap={'2'}>
      <Label size={'small'}>Legg til periode med reduksjon som følge av ytelse fra arbeidsgiver</Label>
      <BodyLong textColor={'subtle'} size={'small'}>
        Ytelsen fra arbeidsgiver skal regnes om til antall dager med 100% reduksjon.
      </BodyLong>
      <TableStyled>
        <Table.Header>
          <Table.Row>
            <Table.HeaderCell>Antall arbeidsdager reduksjon</Table.HeaderCell>
            <Table.HeaderCell>Reduksjon fra dato</Table.HeaderCell>
            <Table.HeaderCell>Til og med</Table.HeaderCell>
            <Table.HeaderCell></Table.HeaderCell>
          </Table.Row>
        </Table.Header>
        <Table.Body>
          {fields.map((field, index) => (
            <Table.Row key={`${field.id}-${index}`}>
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
                <DateInputWrapper
                  control={form.control}
                  label={'Sluttdato'}
                  name={`start`}
                  hideLabel={false}
                  rules={{
                    required: 'Du må velge når reduksjonen gjelder til',
                    validate: (value) => {
                      return validerDato(value as string);
                    },
                  }}
                  readOnly={formReadOnly}
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
