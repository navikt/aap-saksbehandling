'use client';

import { useFieldArray, UseFormReturn, useWatch } from 'react-hook-form';
import { Alert, BodyLong, Button, HStack, Label, Table, VStack } from '@navikt/ds-react';
import { PlusCircleIcon, TrashIcon } from '@navikt/aksel-icons';
import { DateInputWrapper } from 'components/form/dateinputwrapper/DateInputWrapper';
import { TableStyled } from 'components/tablestyled/TableStyled';
import { SamordningArbeidsgiverFormFields } from 'components/behandlinger/samordning/samordningArbeidsgiver/SamordningArbeidsgiver';
import { TextFieldWrapper } from 'components/form/textfieldwrapper/TextFieldWrapper';
import { addBusinessDays, areIntervalsOverlapping, format, isValid, parse } from 'date-fns';
import { useEffect } from 'react';

interface Props {
  form: UseFormReturn<SamordningArbeidsgiverFormFields>;
  readOnly: boolean;
}

export const SamordningArbeidsGiverTabell = ({ form, readOnly }: Props) => {
  const { fields, append, remove } = useFieldArray({
    name: 'perioder',
    control: form.control,
    rules: {
      validate: (perioder: any) => {
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
      antallDager: '',
      fom: '',
      tom: '',
    });
  };

  return (
    <VStack gap="2">
      <Label size="small">Legg til periode med reduksjon som følge av ytelse fra arbeidsgiver</Label>
      <BodyLong textColor="subtle" size="small">
        Ytelsen fra arbeidsgiver skal regnes om til antall dager med 100% reduksjon.
      </BodyLong>

      <TableStyled>
        <Table.Header>
          <Table.Row>
            <Table.HeaderCell textSize={'small'}>Antall arbeidsdager reduksjon</Table.HeaderCell>
            <Table.HeaderCell textSize={'small'}>Reduksjon fra dato</Table.HeaderCell>
            <Table.HeaderCell textSize={'small'}>Til og med</Table.HeaderCell>
            <Table.HeaderCell></Table.HeaderCell>
          </Table.Row>
        </Table.Header>

        <Table.Body>
          {fields.map((field, index) => (
            <AutoFillTomRow key={field.id} index={index} form={form} readOnly={readOnly} remove={remove} />
          ))}
        </Table.Body>
      </TableStyled>

      <HStack>
        <Button
          size="small"
          type="button"
          variant="tertiary"
          icon={<PlusCircleIcon />}
          onClick={leggTilRad}
          disabled={readOnly}
        >
          Legg til
        </Button>
      </HStack>
      {form.formState.errors.perioder?.root && (
        <Alert variant={'error'}>{form.formState.errors.perioder.root.message}</Alert>
      )}
    </VStack>
  );
};

interface AutoFillTomRowProps {
  index: number;
  form: UseFormReturn<SamordningArbeidsgiverFormFields>;
  readOnly: boolean;
  remove: (index: number) => void;
}

const AutoFillTomRow = ({ index, form, readOnly, remove }: AutoFillTomRowProps) => {
  const { control, setValue, getValues } = form;

  const antallDager = useWatch({
    control,
    name: `perioder.${index}.antallDager`,
  });

  const fom = useWatch({
    control,
    name: `perioder.${index}.fom`,
  });

  useEffect(() => {
    const resetTomDate = () => {
      setValue(`perioder.${index}.tom`, '', { shouldDirty: true });
    };

    if (!antallDager || !fom) {
      resetTomDate();
      return;
    }

    const days = parseInt(String(antallDager), 10);
    const startDate = parse(String(fom), 'dd.MM.yyyy', new Date());

    if (isNaN(days) || days <= 0 || !isValid(startDate)) {
      resetTomDate();
      return;
    }

    const calculatedTom = addBusinessDays(startDate, days - 1);
    const formattedTom = format(calculatedTom, 'dd.MM.yyyy');

    setValue(`perioder.${index}.tom`, formattedTom, {
      shouldDirty: true,
      shouldValidate: true,
    });
  }, [antallDager, fom, index, setValue, getValues, form]);

  return (
    <Table.Row>
      <Table.DataCell>
        <TextFieldWrapper
          size={'small'}
          type="number"
          control={control}
          name={`perioder.${index}.antallDager`}
          hideLabel={true}
          rules={{
            required: 'Du må fylle inn antall dager',
            min: { value: 1, message: 'Må være minst 1' },
          }}
          readOnly={readOnly}
        />
      </Table.DataCell>

      <Table.DataCell>
        <DateInputWrapper
          control={control}
          name={`perioder.${index}.fom`}
          hideLabel={true}
          rules={{
            required: 'Du må velge fra-dato',
          }}
          readOnly={readOnly}
        />
      </Table.DataCell>
      <Table.DataCell>
        <DateInputWrapper control={control} name={`perioder.${index}.tom`} hideLabel={true} readOnly={true} />
      </Table.DataCell>

      <Table.DataCell>
        <Button
          size="small"
          icon={<TrashIcon title="Slett" />}
          variant="tertiary"
          type="button"
          onClick={() => remove(index)}
          disabled={readOnly}
        />
      </Table.DataCell>
    </Table.Row>
  );
};
