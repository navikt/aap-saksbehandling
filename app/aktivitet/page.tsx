'use client';

import { useConfigForm } from 'hooks/FormHook';
import { FormField } from 'components/input/formfield/FormField';
import { JaEllerNei, JaEllerNeiOptions } from 'lib/utils/form';
import styles from './page.module.css';
import { FigureIcon } from '@navikt/aksel-icons';
import { VilkårsKort } from 'components/vilkårskort/VilkårsKort';

interface FormFields {
  begrunnelse: string;
  aktivitetspliktOppfylt: string;
  grunn?: string;
  dato?: Date;
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
    grunn: {
      type: 'radio',
      label: 'Begrunnelse',
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
  return (
    <div className={styles.aktivitetSkjema}>
      <VilkårsKort heading={'Vurder aktivitetsplikt'} steg={'AKTIVITET'} icon={<FigureIcon fontSize={'inherit'} />}>
        <form>
          <FormField form={form} formField={formFields.begrunnelse} />
          <FormField form={form} formField={formFields.aktivitetspliktOppfylt} />
          {aktivitetspliktOppfylt === JaEllerNei.Nei && <FormField form={form} formField={formFields.grunn} />}
          <FormField form={form} formField={formFields.dato} />
        </form>
      </VilkårsKort>
    </div>
  );
}
