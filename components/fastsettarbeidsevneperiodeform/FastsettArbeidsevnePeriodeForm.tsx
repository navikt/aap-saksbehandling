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
  arbeidsevne: string;
  benevning: string;
  fraDato: Date;
  id: string;
}

interface FormFields {
  arbeidsevne: string;
  fraDato: Date;
}

export const FastsettArbeidsevnePeriodeForm = ({ periode, onSave }: Props) => {
  const [activeToggle, setActiveToggle] = useState('timer');
  const { form, formFields } = useConfigForm<FormFields>({
    arbeidsevne: {
      type: 'text',
      label: '',
      defaultValue: periode?.arbeidsevne,
    },
    fraDato: {
      type: 'date',
      label: 'Arbeidsevnen gjelder fra og med',
      defaultValue: periode?.fraDato,
    },
  });
  const labelTimer = 'Hvor stor er arbeidsevnen sett opp mot en arbeidsuke på 37,5 timer';
  const labelProsent = 'Hvor stor er arbeidsevnen i prosent?';

  return (
    <form
      onSubmit={form.handleSubmit((data) => {
        if (periode) {
          onSave({ ...data, id: periode.id, benevning: activeToggle });
        } else {
          onSave({ ...data, id: `placeholder-id-${Math.floor(Math.random() * 1000)}`, benevning: activeToggle });
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
          <span>
            <FormField
              form={form}
              formField={{ ...formFields.arbeidsevne, label: activeToggle === 'timer' ? labelTimer : labelProsent }}
            />
            {`${activeToggle === 'timer' ? 'timer' : '%'}`}
          </span>
        </div>
        <FormField form={form} formField={formFields.fraDato} />
        <Button>Lagre</Button>
      </div>
    </form>
  );
};
