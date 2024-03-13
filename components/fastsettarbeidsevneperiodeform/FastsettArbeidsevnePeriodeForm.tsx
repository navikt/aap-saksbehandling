import { useConfigForm } from 'hooks/FormHook';
import { FormField } from 'components/input/formfield/FormField';
import { useState } from 'react';
import { Button, ToggleGroup } from '@navikt/ds-react';

import styles from './FastsettArbeidsevnePeriodeForm.module.css';

interface Props {
  periode?: FastSettArbeidsevnePeriode;
  onSave: (periode: FastSettArbeidsevnePeriode) => void;
}

export interface FastSettArbeidsevnePeriode {
  timer: string;
  fraDato: Date;
  id: string;
}

interface FormFields {
  timer: string;
  fraDato: Date;
}

export const FastsettArbeidsevnePeriodeForm = ({ periode, onSave }: Props) => {
  const [activeToggle, setActiveToggle] = useState('');
  const { form, formFields } = useConfigForm<FormFields>({
    timer: {
      type: 'text',
      label: 'Hvor stor er arbeidsevnen sett opp mot en arbeidsuke på 37,5 timer',
      defaultValue: periode?.timer,
    },
    fraDato: {
      type: 'date',
      label: 'Arbeidsevnen gjelder fra og med',
      defaultValue: periode?.fraDato,
    },
  });

  return (
    <form
      onSubmit={form.handleSubmit((data) => {
        if (periode) {
          onSave({ ...data, id: periode.id });
        } else {
          onSave({ ...data, id: 'something' });
        }
      })}
      className={styles.fastsettArbeidsEvneForm}
    >
      <div className={styles.fastsettArbeidsEvneFormFelter}>
        <div>
          <ToggleGroup defaultValue="timer" onChange={(value) => setActiveToggle(value)} size={'small'}>
            <ToggleGroup.Item value="timer">Timer</ToggleGroup.Item>
            <ToggleGroup.Item value="prosent">Prosent</ToggleGroup.Item>
          </ToggleGroup>
          <FormField form={form} formField={formFields.timer} />
          {activeToggle === 'prosent' && <span>%</span>}
        </div>
        <FormField form={form} formField={formFields.fraDato} />
        <Button>Lagre</Button>
      </div>
    </form>
  );
};
