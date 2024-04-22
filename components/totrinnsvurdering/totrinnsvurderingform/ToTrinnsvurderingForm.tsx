'use client';

import { useConfigForm } from 'hooks/FormHook';
import {
  Behovstype,
  getStringEllerUndefined,
  getValueFromBooleanUndefinedNull,
  JaEllerNei,
  mapBehovskodeTilBehovstype,
} from 'lib/utils/form';
import { FormField } from 'components/input/formfield/FormField';
import { Alert, Button } from '@navikt/ds-react';

import styles from 'components/totrinnsvurdering/totrinnsvurderingform/ToTrinnsvurderingForm.module.css';
import { useState } from 'react';
import { ToTrinnsVurdering } from 'lib/types/types';
import { Veiledning } from 'components/veiledning/Veiledning';
import Link from 'next/link';

interface Props {
  toTrinnsVurdering: ToTrinnsVurdering;
  lagreToTrinnskontroll: (toTrinnskontroll: ToTrinnsVurdering) => void;
  link: string;
  readOnly: boolean;
}

interface FormFields {
  godkjent: string;
  begrunnelse: string;
  grunn: string;
}

export const ToTrinnsvurderingForm = ({ toTrinnsVurdering, lagreToTrinnskontroll, readOnly, link }: Props) => {
  const [erSendtInn, setErSendtInn] = useState(false);
  const { form, formFields } = useConfigForm<FormFields>(
    {
      godkjent: {
        type: 'radio',
        label: 'Er du enig?',
        defaultValue: getValueFromBooleanUndefinedNull(toTrinnsVurdering.godkjent),
        options: [
          { label: 'Godkjenn', value: 'true' },
          { label: 'Vurdér på nytt', value: 'false' },
        ],
        rules: { required: 'Du må svare om du er enig' },
      },
      begrunnelse: {
        type: 'textarea',
        label: 'Begrunnelse',
        defaultValue: getStringEllerUndefined(toTrinnsVurdering.begrunnelse),
        rules: {
          validate: (value, formValues) => {
            if (!value && formValues.godkjent === JaEllerNei.Nei) {
              return 'Du må skrive en begrunnelse';
            }
          },
        },
      },
      grunn: {
        type: 'checkbox',
        label: 'Velg grunn',
        options: [
          'Mangelfull begrunnelse',
          'Manglende utredning',
          'Feil lovanvendelse',
          'Annet (Skriv i begrunnelsen)',
        ],
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
      <Link href={link}>{mapBehovskodeTilBehovstype(toTrinnsVurdering.definisjon as Behovstype)}</Link>
      <FormField form={form} formField={formFields.godkjent} />
      {form.watch('godkjent') === 'false' && (
        <>
          <Veiledning
            header={'Overskrift'}
            tekst={veiledningsTekstPåDefinisjon(toTrinnsVurdering.definisjon as Behovstype)}
            defaultOpen={!readOnly}
          />
          <FormField form={form} formField={formFields.begrunnelse} />
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
