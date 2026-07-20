'use client';

import { useFieldArray, UseFormReturn } from 'react-hook-form';
import { SamordningAndreStatligeYtelserFormFields } from 'components/behandlinger/samordning/samordningandrestatlige/SamordningAndreStatligeYtelser';
import { Button } from '@navikt/ds-react/Button';
import { HStack, VStack } from '@navikt/ds-react/Stack';
import { Table } from '@navikt/ds-react/Table';
import { BodyLong, Label } from '@navikt/ds-react/Typography';
import { PlusCircleIcon, TrashIcon } from '@navikt/aksel-icons';
import { SelectWrapper } from 'components/form/selectwrapper/SelectWrapper';
import { DateInputWrapper } from 'components/form/dateinputwrapper/DateInputWrapper';
import { erDatoFoerDato, validerDato } from 'lib/validation/dateValidation';
import { ValuePair } from 'components/form/FormField';
import { SamordningAndreStatligeYtelserYtelse } from 'lib/types/types';
import { TableStyled } from 'components/tablestyled/TableStyled';
import { Alert } from 'components/alert/Alert';
import { useEffect, useState } from 'react';

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
    value: 'SYKEPENGER',
    label: 'Sykepenger',
  },
  {
    value: 'FORELDREPENGER',
    label: 'Foreldrepenger',
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
    value: 'GJENLEVENDEPENSJON',
    label: 'Gjenlevendepensjon',
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
  const [skalViseInfoMelding, setSkalViseInfoMelding] = useState(false);
  const { fields, append, remove } = useFieldArray({ name: 'vurderteSamordninger', control: form.control });

  function leggTilRad() {
    append({
      ytelse: undefined,
      fom: '',
      tom: '',
    });
    setSkalViseInfoMelding(true);
  }

  useEffect(() => {
    if (fields.length === 0) {
      setSkalViseInfoMelding(false);
    }
  }, [fields.length]);

  return (
    <VStack gap={'space-8'}>
      <Label size={'small'}>Legg til ytelse og periode for utbetaling</Label>
      <BodyLong size={'small'}>
        Legg til perioder der brukeren har hatt andre statlige ytelser. Disse ytelsene skal gi fradrag i etterbetalingen
        av AAP. Etterbetaling for perioden holdes automatisk igjen hos NØS i 42 dager. Annen ytelse må varsles manuelt i
        Gosys.
      </BodyLong>
      <TableStyled>
        <Table.Header>
          <Table.Row>
            <Table.HeaderCell>Ytelse</Table.HeaderCell>
            <Table.HeaderCell>Periode</Table.HeaderCell>
            <Table.HeaderCell></Table.HeaderCell>
          </Table.Row>
        </Table.Header>
        <Table.Body>
          {fields.map((field, index) => (
            <Table.Row key={`${field.id}-${index}`}>
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
                  {ytelsesoptions.map((ytelse, index) => (
                    <option value={ytelse.value} key={index}>
                      {ytelse.label}
                    </option>
                  ))}
                </SelectWrapper>
              </Table.DataCell>
              <Table.DataCell>
                <HStack align={'center'} gap={'space-4'}>
                  <DateInputWrapper
                    control={form.control}
                    name={`vurderteSamordninger.${index}.fom`}
                    hideLabel={true}
                    rules={{
                      required: 'Du må velge dato for periodestart',
                      validate: {
                        gyldigDato: (value) => validerDato(value as string),
                        ikkeFoerStart: (value, formValues) =>
                          value && erDatoFoerDato(formValues.vurderteSamordninger[index].tom, value as string)
                            ? 'Fra og med dato kan ikke være etter til og med dato'
                            : undefined,
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
                {!readOnly && (
                  <Button
                    size={'small'}
                    icon={<TrashIcon title={'Slett'} />}
                    variant={'tertiary'}
                    type={'button'}
                    onClick={() => remove(index)}
                  />
                )}
              </Table.DataCell>
            </Table.Row>
          ))}
        </Table.Body>
      </TableStyled>
      <HStack>
        {!readOnly && (
          <Button size={'small'} type={'button'} variant={'tertiary'} icon={<PlusCircleIcon />} onClick={leggTilRad}>
            Legg til
          </Button>
        )}
      </HStack>
      {skalViseInfoMelding && (
        <Alert variant={'info'}>Har du husket å sende gosysoppgaver i henhold til rutinen?</Alert>
      )}
    </VStack>
  );
};
