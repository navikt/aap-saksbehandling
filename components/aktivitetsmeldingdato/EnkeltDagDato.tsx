import { Button, DatePicker, useDatepicker } from '@navikt/ds-react';

import styles from './AktivitetsmeldingDato.module.css';
import { TrashIcon } from '@navikt/aksel-icons';

interface Props {
  onChange: (date: Date) => void;
  onDelete: () => void;
}

export const EnkeltDagDato = ({ onChange, onDelete }: Props) => {
  const { datepickerProps, inputProps } = useDatepicker({
    onDateChange: (date) => {
      if (date) onChange(date);
    },
  });

  return (
    <div className={styles.periodedatoer}>
      <DatePicker {...datepickerProps}>
        <DatePicker.Input size={'small'} label={'Dato for fravær'} {...inputProps} />
      </DatePicker>
      <div />
      <div>
        <Button type={'button'} size={'small'} variant={'tertiary'} onClick={onDelete} icon={<TrashIcon />}>
          Fjern enkeltdag
        </Button>
      </div>
    </div>
  );
};
