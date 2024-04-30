'use client';

import { useConfigForm } from 'hooks/FormHook';
import { FormField } from 'components/input/formfield/FormField';
import { JaEllerNei, JaEllerNeiOptions } from 'lib/utils/form';
import styles from './page.module.css';
import { FigureIcon } from '@navikt/aksel-icons';
import { VilkårsKort } from 'components/vilkårskort/VilkårsKort';
import { Button } from '@navikt/ds-react';

interface FormFields {
  begrunnelse: string;
  aktivitetspliktOppfylt: string;
  grunn?: string;
  dato?: Date;
  hjemmel: string;
}
export default function Page() {
  const { form, formFields } = useConfigForm<FormFields>({
    begrunnelse: {
      type: 'text',
      label: 'Begrunnelse',
      rules: { required: 'Du må begrunne' },
    },
    aktivitetspliktOppfylt: {
      type: 'radio',
      label: 'Er aktivitetsplikt oppfylt?',
      rules: { required: 'Du må svare på om vilkåret er oppfyllt' },
      options: JaEllerNeiOptions,
    },
    hjemmel: {
      type: 'select',
      label: 'Hjemmel',
      options: ['§11-7', '§11-8', '§11-9'],
    },
    grunn: {
      type: 'radio',
      label: 'Årsak',
      options: [
        'Ikke møtt til møte med Nav',
        'Ikke møtt i behandling',
        'Ikke møtt i tiltak',
        'Bruker har ikke sendt inn dokumentasjon som Nav har bedt om',
        'Ikke bidratt til egen avklaring',
      ],
    },
    dato: {
      type: 'date',
      label: 'Dato',
    },
  });
  const aktivitetspliktOppfylt = form.watch('aktivitetspliktOppfylt');
  const hjemmel = form.watch('hjemmel');
  const buttonText = hjemmel === '§11-7' || hjemmel === '§11-8' ? 'Send forhåndsvarsel' : 'Send';
  return (
    <div className={styles.aktivitetSkjema}>
      <VilkårsKort heading={'Vurder aktivitetsplikt'} steg={'FATTE_VEDTAK'} icon={<FigureIcon fontSize={'inherit'} />}>
        <form className={styles.form}>
          <FormField form={form} formField={formFields.begrunnelse} />
          <FormField form={form} formField={formFields.aktivitetspliktOppfylt} />
          {aktivitetspliktOppfylt === JaEllerNei.Nei && (
            <>
              <FormField form={form} formField={formFields.hjemmel} />
              <FormField form={form} formField={formFields.grunn} />
            </>
          )}
          <FormField form={form} formField={formFields.dato} />
          <Button>{buttonText}</Button>
        </form>
      </VilkårsKort>
    </div>
  );
}
