'use client';

import { useConfigForm } from 'hooks/FormHook';
import { Behovstype, GodkjennEllerUnderkjennOptions, JaEllerNei, mapBehovskodeTilBehovstype } from 'lib/utils/form';
import { FormField } from 'components/input/formfield/FormField';
import { Alert, Button, Label } from '@navikt/ds-react';

import styles from 'components/totrinsskontroll/totrinnskontrollform/ToTrinnsKontrollForm.module.css';
import { useState } from 'react';
import { ToTrinnsVurdering } from 'lib/types/types';
import { Veiledning } from 'components/veiledning/Veiledning';

interface Props {
  toTrinnsVurdering: ToTrinnsVurdering;
  lagreToTrinnskontroll: (toTrinnskontroll: ToTrinnsVurdering) => void;
  readOnly: boolean;
}

interface FormFields {
  godkjent: string;
  begrunnelse: string;
  grunn: string;
}

export const ToTrinnsKontrollForm = ({ toTrinnsVurdering, lagreToTrinnskontroll, readOnly }: Props) => {
  const [erSendtInn, setErSendtInn] = useState(false);
  const { form, formFields } = useConfigForm<FormFields>(
    {
      godkjent: {
        type: 'radio',
        label: 'Er du enig?',
        options: GodkjennEllerUnderkjennOptions,
        rules: { required: 'Du må svare om du er enig' },
      },
      begrunnelse: {
        type: 'textarea',
        label: 'Begrunnelse',
        rules: {
          validate: (value, formValues) => {
            if (!value && formValues.godkjent === JaEllerNei.Nei) {
              return 'Du må skrive en begrunnelse';
            }
          },
        },
      },
      grunn: {
        type: 'select',
        label: 'Velg grunn',
        options: ['Grunn 1', 'Grunn 2', 'Grunn 3'],
      },
    },
    { readOnly: readOnly }
  );

  return (
    <form
      onSubmit={form.handleSubmit((data) => {
        lagreToTrinnskontroll({
          definisjon: toTrinnsVurdering.definisjon,
          godkjent: data.godkjent === 'true',
          begrunnelse: data?.begrunnelse,
        });
        setErSendtInn(true);
      })}
      className={styles.form}
    >
      {/*TODO Fiks den syke typen her Thomas*/}
      <Label size={'medium'}>{mapBehovskodeTilBehovstype(toTrinnsVurdering as unknown as Behovstype)}</Label>
      <FormField form={form} formField={formFields.godkjent} />
      {form.watch('godkjent') === 'false' && (
        <>
          <FormField form={form} formField={formFields.begrunnelse} />
          <Veiledning
            header={'Overskrift'}
            tekst={veiledningsTekstPåDefinisjon(toTrinnsVurdering.definisjon as Behovstype)}
          />
          <FormField form={form} formField={formFields.grunn} />
        </>
      )}
      {!readOnly && (
        <div>
          {erSendtInn ? (
            <Alert size={'small'} variant={'success'}>
              Fullført
            </Alert>
          ) : (
            <Button size={'small'}>Bekreft</Button>
          )}
        </div>
      )}
    </form>
  );
};

function veiledningsTekstPåDefinisjon(definisjon: Behovstype): string {
  if (definisjon === '5003') {
    return 'Husk at du som beslutter ikke skal overprøve skjønnet knyttet til nedsatt arbeidsevne';
  } else if (definisjon === '5006') {
    return 'Husk at du som beslutter ikke skal overprøve skjønnet knyttet til bistandsbehovet';
  } else {
    return 'Her kommer noe veildeningstekst';
  }
}
