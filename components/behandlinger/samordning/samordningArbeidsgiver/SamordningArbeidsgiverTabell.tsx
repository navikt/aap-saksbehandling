'use client';

import { useFieldArray, UseFormReturn } from 'react-hook-form';
import { Button, HStack, Label, Table, VStack } from '@navikt/ds-react';
import { PlusCircleIcon, TrashIcon } from '@navikt/aksel-icons';
import { DateInputWrapper } from 'components/form/dateinputwrapper/DateInputWrapper';
import { TableStyled } from 'components/tablestyled/TableStyled';
import { SamordningArbeidsgiverFormFields } from 'components/behandlinger/samordning/samordningArbeidsgiver/SamordningArbeidsgiver';
import { areIntervalsOverlapping, parse } from 'date-fns';
import { Alert } from 'components/alert/Alert';
import { erDatoFoerDato, validerDato } from 'lib/validation/dateValidation';

interface Props {
  form: UseFormReturn<SamordningArbeidsgiverFormFields>;
  readOnly: boolean;
}

export const SamordningArbeidsGiverTabell = ({ form, readOnly }: Props) => {
  const { fields, append, remove } = useFieldArray({
    name: 'perioder',
    control: form.control,
    rules: {
      validate: (perioder: SamordningArbeidsgiverFormFields['perioder']) => {
        if (!perioder || perioder.length < 2) {
          return true;
        }

        for (let i = 0; i < perioder.length; i++) {
          for (let j = i + 1; j < perioder.length; j++) {
            const periodeA = perioder[i];
            const periodeB = perioder[j];

            if (!periodeA?.fom || !periodeA?.tom || !periodeB?.fom || !periodeB?.tom) {
              continue;
            }

            const intervalA = {
              start: parse(periodeA.fom, 'dd.MM.yyyy', new Date()),
              end: parse(periodeA.tom, 'dd.MM.yyyy', new Date()),
            };

            const intervalB = {
              start: parse(periodeB.fom, 'dd.MM.yyyy', new Date()),
              end: parse(periodeB.tom, 'dd.MM.yyyy', new Date()),
            };

            if (areIntervalsOverlapping(intervalA, intervalB, { inclusive: true })) {
              return 'Periodene kan ikke overlappe';
            }
          }
        }
        return true;
      },
    },
  });

  const leggTilRad = () => {
    append({
      fom: '',
      tom: '',
    });
  };

  return (
    <VStack gap="space-8">
      <Label size="small">Legg til periode med reduksjon som følge av ytelse fra arbeidsgiver</Label>
      <TableStyled>
        <Table.Header>
          <Table.Row>
            <Table.HeaderCell textSize={'small'}>Reduksjon fra dato</Table.HeaderCell>
            <Table.HeaderCell textSize={'small'}>Til og med</Table.HeaderCell>
            <Table.HeaderCell></Table.HeaderCell>
          </Table.Row>
        </Table.Header>

        <Table.Body>
          {fields.map((field, index) => (
            <PeriodeRow key={field.id} index={index} form={form} readOnly={readOnly} remove={remove} />
          ))}
        </Table.Body>
      </TableStyled>
      {!readOnly && (
        <HStack>
          <Button size="small" type="button" variant="tertiary" icon={<PlusCircleIcon />} onClick={leggTilRad}>
            Legg til
          </Button>
        </HStack>
      )}
      {form.formState.errors.perioder?.root && (
        <Alert variant={'error'}>{form.formState.errors.perioder.root.message}</Alert>
      )}
    </VStack>
  );
};

interface PeriodeRowProps {
  index: number;
  form: UseFormReturn<SamordningArbeidsgiverFormFields>;
  readOnly: boolean;
  remove: (index: number) => void;
}

const PeriodeRow = ({ index, form, readOnly, remove }: PeriodeRowProps) => {
  const { control } = form;
  return (
    <Table.Row>
      <Table.DataCell>
        <DateInputWrapper
          control={control}
          name={`perioder.${index}.fom`}
          hideLabel={true}
          rules={{
            required: 'Du må velge fra-dato',
            validate: { validerDato: (value) => validerDato(value as string) },
          }}
          readOnly={readOnly}
        />
      </Table.DataCell>
      <Table.DataCell>
        <DateInputWrapper
          control={control}
          name={`perioder.${index}.tom`}
          hideLabel={true}
          rules={{
            required: 'Du må velge til-dato',
            validate: {
              validerDato: (value) => validerDato(value as string),
              validerIkkeFørDato: (value, formValues) => {
                if (!value) {
                  return;
                }

                const erFomFørTom = erDatoFoerDato(value as string, formValues.perioder[index]?.fom);

                return erFomFørTom ? 'Til-dato kan ikke være før fra-dato' : undefined;
              },
            },
          }}
          readOnly={readOnly}
        />
      </Table.DataCell>

      <Table.DataCell>
        {!readOnly && (
          <Button
            size="small"
            icon={<TrashIcon title="Slett" />}
            variant="tertiary"
            type="button"
            onClick={() => remove(index)}
          />
        )}
      </Table.DataCell>
    </Table.Row>
  );
};
