import { useConfigForm, FormField } from '@navikt/aap-felles-react';
import { useState } from 'react';
import { Button, Heading, ToggleGroup } from '@navikt/ds-react';
import styles from './FastsettArbeidsevnePeriodeForm.module.css';
import { DokumentTabell } from 'components/dokumenttabell/DokumentTabell';
import { Veiledning } from 'components/veiledning/Veiledning';
import { v4 as uuidv4 } from 'uuid';

interface Props {
  onSave: (periode: FastSettArbeidsevnePeriode) => void;
  onAvbryt: () => void;
}

export interface FastSettArbeidsevnePeriode extends FormFields {
  benevning: 'timer' | 'prosent';
  id: string;
}

interface FormFields {
  arbeidsevne: string;
  fraDato: Date;
  dokumenterBruktIVurderingen?: string[];
  begrunnelse: string;
}

export const FastsettArbeidsevnePeriodeForm = ({ onSave, onAvbryt }: Props) => {
  const [activeToggle, setActiveToggle] = useState<'timer' | 'prosent'>('timer');
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
      description: 'sett opp mot en arbeidsuke på 37,5 timer',
      rules: { required: 'Du må angi en arbeidsevne.' },
    },
    fraDato: {
      type: 'date',
      label: 'Arbeidsevnen gjelder fra og med',
      rules: { required: 'Du må angi når perioden med arbeidsevne starter.' },
    },
  });

  const labelTimer = 'Hvor stor er arbeidsevnen i timer?';
  const labelProsent = 'Hvor stor er arbeidsevnen i prosent?';

  return (
    <form
      onSubmit={form.handleSubmit((data) => {
        onSave({ ...data, id: uuidv4(), benevning: activeToggle });
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
        <Veiledning />

        <FormField form={form} formField={formFields.begrunnelse} />
        <div className={styles.prosenttimer}>
          <FormField
            form={form}
            formField={{ ...formFields.arbeidsevne, label: activeToggle === 'timer' ? labelTimer : labelProsent }}
          />
          <ToggleGroup
            defaultValue="timer"
            onChange={(value) => {
              if (value === 'timer' || value === 'prosent') {
                setActiveToggle(value);
              }
            }}
            size={'small'}
          >
            <ToggleGroup.Item value="timer">Timer</ToggleGroup.Item>
            <ToggleGroup.Item value="prosent">Prosent</ToggleGroup.Item>
          </ToggleGroup>
        </div>
        <FormField form={form} formField={formFields.fraDato} />
        <div className={styles.knapper}>
          <Button size={'medium'}>Lagre</Button>
          <Button
            variant={'secondary'}
            size={'medium'}
            onClick={(e) => {
              e.preventDefault();
              onAvbryt();
            }}
          >
            Avbryt
          </Button>
        </div>
      </div>
    </form>
  );
};
