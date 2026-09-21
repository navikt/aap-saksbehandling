import { TrashIcon } from '@navikt/aksel-icons';
import { Button, HStack, Table } from '@navikt/ds-react';
import { SamordningGraderingFormfields } from 'components/behandlinger/samordning/samordninggradering/SamordningGradering';
import { DateInputWrapper } from 'components/form/dateinputwrapper/DateInputWrapper';
import { ValuePair } from 'components/form/FormField';
import { SelectWrapper } from 'components/form/selectwrapper/SelectWrapper';
import { TextFieldWrapper } from 'components/form/textfieldwrapper/TextFieldWrapper';
import { SamordningYtelsestype } from 'lib/types/types';
import { erDatoFoerDato, validerDato } from 'lib/validation/dateValidation';
import { UseFormReturn } from 'react-hook-form';

import styles from 'components/behandlinger/samordning/samordninggradering/YtelseTabell.module.css';

interface Props {
  form: UseFormReturn<SamordningGraderingFormfields>;
  index: number;
  readOnly: boolean;
  ytelsesoptioner: ValuePair<SamordningYtelsestype | undefined>[];
  onSlett: () => void;
}

export const YtelsesvurderingRad = ({ form, index, readOnly, ytelsesoptioner, onSlett }: Props) => (
  <Table.Row>
    <Table.DataCell>
      <HStack align={'start'} gap={'space-4'}>
        <DateInputWrapper
          label="Fra og med"
          control={form.control}
          name={`vurderteSamordninger.${index}.periode.fom`}
          hideLabel={true}
          rules={{
            required: 'Du må velge dato for periodestart',
            validate: {
              gyldigDato: (value) => validerDato(value as string),
              ikkeFoerStart: (value, formValues) =>
                value && erDatoFoerDato(formValues.vurderteSamordninger[index].periode.tom, value as string)
                  ? 'Fra og med dato kan ikke være etter til og med dato'
                  : undefined,
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
        {ytelsesoptioner.map((ytelse, index) => (
          <option value={ytelse.value} key={index}>
            {ytelse.label}
          </option>
        ))}
      </SelectWrapper>
    </Table.DataCell>
    <Table.DataCell>
      <TextFieldWrapper
        name={`vurderteSamordninger.${index}.gradering`}
        label={'Samordningsgrad'}
        hideLabel
        type={'text'}
        size={'small'}
        className={styles.samordningsgrad}
        control={form.control}
        readOnly={readOnly}
        rules={{
          required: 'Du må velge samordningsgrad',
          validate: (value) => {
            if (Number.isNaN(Number(value))) {
              return 'Prosent må angis med siffer';
            }
            if (Number(value) < 0) {
              return 'Samordningsgrad kan ikke være mindre enn 0%';
            }
            if (Number(value) > 100) {
              return 'Samordningsgrad kan ikke være mer enn 100%';
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
        onClick={onSlett}
        disabled={readOnly}
      />
    </Table.DataCell>
  </Table.Row>
);
