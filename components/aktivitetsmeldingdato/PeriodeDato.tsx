import { Button, DatePicker, useDatepicker } from '@navikt/ds-react';

import styles from './AktivitetsmeldingDato.module.css';
import { TrashIcon } from '@navikt/aksel-icons';

interface Props {
  onChange: (felt: 'tom' | 'fom', date: Date) => void;
  onDelete: () => void;
}

export const PeriodeDato = ({ onChange, onDelete }: Props) => {
  const { datepickerProps: tomDatepickerProps, inputProps: tomInputProps } = useDatepicker({
    onDateChange: (date) => {
      if (date) onChange('tom', date);
    },
  });

  const { datepickerProps: fomDatepickerProps, inputProps: fomInputProps } = useDatepicker({
    onDateChange: (date) => {
      if (date) onChange('fom', date);
    },
  });

  return (
    <div className={styles.periodedatoer}>
      <DatePicker {...fomDatepickerProps}>
        <DatePicker.Input size={'small'} label={'Fra og med dato for fravær'} {...fomInputProps} />
      </DatePicker>
      <DatePicker {...tomDatepickerProps}>
        <DatePicker.Input size={'small'} label={'Til og med dato for fravær'} {...tomInputProps} />
      </DatePicker>
      <div>
        <Button type={'button'} size={'small'} variant={'tertiary'} onClick={onDelete} icon={<TrashIcon />}>
          Fjern periode
        </Button>
      </div>
    </div>
  );
};
