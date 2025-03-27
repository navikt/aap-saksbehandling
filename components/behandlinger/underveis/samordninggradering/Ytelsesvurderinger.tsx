import { PlusCircleIcon, TrashIcon } from '@navikt/aksel-icons';
import { BodyShort, Box, Button, HStack, Label, Table, VStack } from '@navikt/ds-react';
import { SamordningGraderingFormfields } from 'components/behandlinger/underveis/samordninggradering/SamordningGradering';
import { DateInputWrapper } from 'components/form/dateinputwrapper/DateInputWrapper';
import { ValuePair } from 'components/form/FormField';
import { SelectWrapper } from 'components/form/selectwrapper/SelectWrapper';
import { TextFieldWrapper } from 'components/form/textfieldwrapper/TextFieldWrapper';
import { SamordningYtelsestype } from 'lib/types/types';
import { validerDato } from 'lib/validation/dateValidation';
import { useFieldArray, UseFormReturn } from 'react-hook-form';

import styles from './YtelseTabell.module.css';

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

export const Ytelsesvurderinger = ({ form, readOnly }: Props) => {
  const { fields, remove, append } = useFieldArray({
    control: form.control,
    name: 'vurderteSamordninger',
  });

  function leggTilRad() {
    append({
      kilde: '', // TODO denne skal vekk vel?
      manuell: true,
      ytelseType: undefined,
      periode: { fom: '', tom: '' },
      gradering: undefined,
    });
  }

  return (
    <Box paddingBlock={'4'}>
      <VStack gap={'2'} marginBlock={'4'}>
        <Label size="small">Legg til perioder med samordning</Label>
        <BodyShort size="small">
          Legg til perioder med folketrygdytelser som skal samordnes med AAP etter § 11-27 / 11-28. Grad skal settes ut
          fra en arbeidsevne på 37,5t.
        </BodyShort>
      </VStack>
      <Table className={styles.ytelsestabell}>
        <Table.Header>
          <Table.Row>
            <Table.HeaderCell>Periode</Table.HeaderCell>
            <Table.HeaderCell>Ytelse</Table.HeaderCell>
            <Table.HeaderCell>Samordningsgrad (%)</Table.HeaderCell>
            <Table.HeaderCell></Table.HeaderCell>
          </Table.Row>
        </Table.Header>
        <Table.Body>
          {fields.map((_, index) => (
            <Table.Row key={index}>
              <Table.DataCell>
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
              </Table.DataCell>
              <Table.DataCell>
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
              </Table.DataCell>
              <Table.DataCell>
                <TextFieldWrapper
                  name={`vurderteSamordninger.${index}.gradering`}
                  label={'Utbetalingsgrad'}
                  hideLabel
                  type={'text'}
                  size={'small'}
                  className={styles.utbetalingsgrad}
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
    </Box>
  );
};
