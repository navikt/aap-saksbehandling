'use client';

import { useFieldArray, UseFormReturn } from 'react-hook-form';
import { SamordningAndreStatligeYtelserFormFields } from 'components/behandlinger/underveis/samordningandrestatlige/SamordningAndreStatligeYtelser';
import { Button, HStack, Label, Table } from '@navikt/ds-react';
import { TextFieldWrapper } from 'components/form/textfieldwrapper/TextFieldWrapper';
import styles from 'components/behandlinger/underveis/samordninggradering/YtelseTabell.module.css';
import { PlusCircleIcon, TrashIcon } from '@navikt/aksel-icons';
import { SelectWrapper } from 'components/form/selectwrapper/SelectWrapper';
import { DateInputWrapper } from 'components/form/dateinputwrapper/DateInputWrapper';
import { validerDato } from 'lib/validation/dateValidation';
import { ValuePair } from 'components/form/FormField';
import { SamordningAndreStatligeYtelserYtelse } from 'lib/types/types';

interface Props {
  form: UseFormReturn<SamordningAndreStatligeYtelserFormFields>;
  readOnly: boolean;
}

const ytelsesoptions: ValuePair<SamordningAndreStatligeYtelserYtelse | undefined>[] = [
  {
    value: undefined,
    label: 'Velg',
  },
  {
    value: 'TILTAKSPENGER',
    label: 'Tiltakspenger',
  },
  {
    value: 'OMSTILLINGSSTØNAD',
    label: 'Omstillingsstønad',
  },
  {
    value: 'OVERGANGSSTØNAD',
    label: 'Overgangsstønad',
  },
  {
    value: 'DAGPENGER',
    label: 'Dagpenger',
  },
  {
    value: 'BARNEPENSJON',
    label: 'Barnepensjon',
  },
];
export const AndreStatligeYtelserTabell = ({ form, readOnly }: Props) => {
  const { fields, append, remove } = useFieldArray({ name: 'vurderteSamordninger', control: form.control });
  function leggTilRad() {
    append({
      ytelse: undefined,
      fom: '',
      tom: '',
      beløp: undefined,
    });
  }
  return (
    <>
      <Label size={'small'}>Legg til ytelse, periode og beløp for utbetaling</Label>
      <Table>
        <Table.Header>
          <Table.Row>
            <Table.HeaderCell>Ytelse</Table.HeaderCell>
            <Table.HeaderCell>Periode</Table.HeaderCell>
            <Table.HeaderCell>Beløp</Table.HeaderCell>
            <Table.HeaderCell></Table.HeaderCell>
          </Table.Row>
        </Table.Header>
        <Table.Body>
          {fields.map((field, index) => (
            <Table.Row key={field.id}>
              <Table.DataCell>
                <SelectWrapper
                  label="Ytelsestype"
                  size={'small'}
                  hideLabel
                  control={form.control}
                  readOnly={readOnly}
                  name={`vurderteSamordninger.${index}.ytelse`}
                  rules={{ required: 'Du må velge en ytelsetype' }}
                >
                  {ytelsesoptions.map((ytelse) => (
                    <option value={ytelse.value} key={ytelse.value}>
                      {ytelse.label}
                    </option>
                  ))}
                </SelectWrapper>
              </Table.DataCell>
              <Table.DataCell>
                <HStack align={'center'} gap={'1'}>
                  <DateInputWrapper
                    control={form.control}
                    name={`vurderteSamordninger.${index}.fom`}
                    hideLabel={true}
                    rules={{
                      required: 'Du må velge dato for periodestart',
                      validate: (value) => {
                        return validerDato(value as string);
                      },
                    }}
                    readOnly={readOnly}
                  />
                  {'-'}
                  <DateInputWrapper
                    control={form.control}
                    name={`vurderteSamordninger.${index}.tom`}
                    hideLabel={true}
                    rules={{
                      required: 'Du må velge dato for periodeslutt',
                      validate: (value) => {
                        return validerDato(value as string);
                      },
                    }}
                    readOnly={readOnly}
                  />
                </HStack>
              </Table.DataCell>
              <Table.DataCell>
                <TextFieldWrapper
                  name={`vurderteSamordninger.${index}.beløp`}
                  label={'Utbetalingsgrad'}
                  hideLabel
                  type={'text'}
                  size={'small'}
                  control={form.control}
                  readOnly={readOnly}
                  rules={{
                    required: 'Du må velge beløp',
                    validate: (value) => {
                      if (Number.isNaN(Number(value))) {
                        return 'Beløp må angis med siffer';
                      }
                      if (Number(value) < 0) {
                        return 'Beløp kan ikke være mindre enn 0';
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
      </Table>
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
    </>
  );
};
