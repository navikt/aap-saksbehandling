'use client';

import { BodyShort, Button, HStack, Table } from '@navikt/ds-react';
import { SelectWrapper } from 'components/form/selectwrapper/SelectWrapper';
import { DateInputWrapper } from 'components/form/dateinputwrapper/DateInputWrapper';
import { TextFieldWrapper } from 'components/form/textfieldwrapper/TextFieldWrapper';
import { PlusCircleIcon, TrashIcon } from '@navikt/aksel-icons';
import { useFieldArray, UseFormReturn } from 'react-hook-form';
import { SamordningGraderingFormfields } from 'components/behandlinger/underveis/samordninggradering/SamordningGradering';
import { ValuePair } from 'components/form/FormField';
import { SamordningYtelsestype } from 'lib/types/types';

import styles from './YtelseTabell.module.css';
import { validerDato } from 'lib/validation/dateValidation';

interface Props {
  form: UseFormReturn<SamordningGraderingFormfields>;
  readOnly: boolean;
}

const ytelsesoptions: ValuePair<SamordningYtelsestype | undefined>[] = [
  {
    value: undefined,
    label: 'Velg',
  },
  {
    value: 'SYKEPENGER',
    label: 'Sykepenger',
  },
  {
    value: 'FORELDREPENGER',
    label: 'Foreldrepenger',
  },
  {
    value: 'PLEIEPENGER',
    label: 'Pleiepenger',
  },
  {
    value: 'SVANGERSKAPSPENGER',
    label: 'Svangerskapspenger',
  },
  {
    value: 'OMSORGSPENGER',
    label: 'Omsorgspenger',
  },
  {
    value: 'OPPLÆRINGSPENGER',
    label: 'Opplæringspenger',
  },
];

export const YtelseTabell = ({ form, readOnly }: Props) => {
  const { fields, remove, append } = useFieldArray({
    control: form.control,
    name: 'vurderteSamordninger',
  });

  function leggTilRad() {
    append({
      kilde: 'Manuell',
      manuell: true,
      ytelseType: undefined,
      periode: { fom: '', tom: '' },
      graderingFraKilde: undefined,
      gradering: undefined,
    });
  }

  return (
    <>
      <Table>
        <Table.Header>
          <Table.Row>
            <Table.HeaderCell>Ytelse</Table.HeaderCell>
            <Table.HeaderCell>Periode</Table.HeaderCell>
            <Table.HeaderCell>Kilde</Table.HeaderCell>
            <Table.HeaderCell>Grad fra kilde</Table.HeaderCell>
            <Table.HeaderCell>Samordningsgrad (%)</Table.HeaderCell>
            <Table.HeaderCell></Table.HeaderCell>
          </Table.Row>
        </Table.Header>
        <Table.Body>
          {fields.map((field, index) => (
            <Table.Row key={field.id}>
              <Table.DataCell>
                {(field.manuell && (
                  <SelectWrapper
                    label="Ytelsestype"
                    size={'small'}
                    hideLabel
                    control={form.control}
                    readOnly={readOnly}
                    name={`vurderteSamordninger.${index}.ytelseType`}
                    rules={{ required: 'Du må velge en ytelsetype' }}
                  >
                    {ytelsesoptions.map((ytelse) => (
                      <option value={ytelse.value} key={ytelse.value}>
                        {ytelse.label}
                      </option>
                    ))}
                  </SelectWrapper>
                )) || (
                  <>
                    <BodyShort className={styles.capitalize}>{field.ytelseType}</BodyShort>
                    <input {...form.register(`vurderteSamordninger.${index}.ytelseType`)} type="hidden" />
                  </>
                )}
              </Table.DataCell>
              <Table.DataCell>
                {(field.manuell && (
                  <HStack align={'center'} gap={'1'}>
                    <DateInputWrapper
                      label="Fra og med"
                      control={form.control}
                      name={`vurderteSamordninger.${index}.periode.fom`}
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
                      label="Til og med"
                      control={form.control}
                      name={`vurderteSamordninger.${index}.periode.tom`}
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
                )) || (
                  <>
                    <BodyShort>
                      {field.periode.fom} - {field.periode.tom}
                    </BodyShort>
                    <input {...form.register(`vurderteSamordninger.${index}.periode.fom`)} type="hidden" />
                    <input {...form.register(`vurderteSamordninger.${index}.periode.tom`)} type="hidden" />
                  </>
                )}
              </Table.DataCell>
              <Table.DataCell>{field.kilde}</Table.DataCell>
              <Table.DataCell align="right">
                {field.graderingFraKilde ? `${field.graderingFraKilde} %` : '-'}
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
              <Table.DataCell>
                {field.manuell && (
                  <Button
                    size={'small'}
                    icon={<TrashIcon title={'Slett'} />}
                    variant={'tertiary'}
                    type={'button'}
                    onClick={() => remove(index)}
                    disabled={readOnly}
                  />
                )}
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
