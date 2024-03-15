import { useConfigForm } from 'hooks/FormHook';
import { FormField } from 'components/input/formfield/FormField';
import { useState } from 'react';
import { Button, Heading, ToggleGroup } from '@navikt/ds-react';
import styles from './FastsettArbeidsevnePeriodeForm.module.css';
import { DokumentTabell } from 'components/dokumenttabell/DokumentTabell';
import { Vilkårsveildening } from 'components/vilkårsveiledning/Vilkårsveiledning';

interface Props {
  periode?: FastSettArbeidsevnePeriode;
  onSave: (periode: FastSettArbeidsevnePeriode) => void;
}

export interface FastSettArbeidsevnePeriode extends FormFields {
  benevning: string;
  id: string;
}

interface FormFields {
  arbeidsevne: string;
  fraDato: Date;
  dokumenterBruktIVurderingen: string[];
  begrunnelse: string;
}

export const FastsettArbeidsevnePeriodeForm = ({ periode, onSave }: Props) => {
  const [activeToggle, setActiveToggle] = useState('timer');
  const { form, formFields } = useConfigForm<FormFields>({
    begrunnelse: {
      type: 'textarea',
      label: 'Vurder om brukeren har arbeidsevne',
      description: 'En beksrivelse av hva som skal gjøres her',
      rules: { required: 'Du må begrunne avgjørelsen din.' },
    },
    dokumenterBruktIVurderingen: {
      type: 'checkbox_nested',
      label: 'Dokumenter funnet som er relevant for vurdering',
      description: 'Tilknytt minst ett dokument til vurdering',
    },
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
      <Heading size={'small'} level={'4'} spacing>
        Legg til en ny periode med arbeidsevne
      </Heading>
      <div className={styles.fastsettArbeidsEvneFormFelter}>
        <FormField form={form} formField={formFields.dokumenterBruktIVurderingen}>
          <DokumentTabell />
        </FormField>
        <Vilkårsveildening />

        <FormField form={form} formField={formFields.begrunnelse} />
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
