'use client';

import { useConfigForm } from 'hooks/FormHook';
import { JaEllerNeiOptions } from 'lib/utils/form';
import { FormField } from 'components/input/formfield/FormField';
import { Button } from '@navikt/ds-react';

interface Props {
  definisjon: string;
}
interface FormFields {
  oppfylt: string;
  begrunnelse: string;
}

export const ToTrinnsKontroll = ({ definisjon }: Props) => {
  const { form, formFields } = useConfigForm<FormFields>({
    oppfylt: {
      type: 'radio',
      label: 'Er du enig?',
      options: JaEllerNeiOptions,
    },
    begrunnelse: {
      type: 'textarea',
      label: 'Begrunnelse',
    },
  });

  return (
    <form
      onSubmit={form.handleSubmit((data) => console.log(data))}
      style={{ display: 'flex', flexDirection: 'column', gap: '1rem', border: '2px solid black', padding: '1rem' }}
    >
      <span>{definisjon}</span>
      <FormField form={form} formField={formFields.oppfylt} />
      <FormField form={form} formField={formFields.begrunnelse} />
      <div>
        <Button>Bekreft</Button>
      </div>
    </form>
  );
};
