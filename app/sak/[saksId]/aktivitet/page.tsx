'use client';

import { useConfigForm } from 'hooks/FormHook';
import { FormField } from 'components/input/formfield/FormField';
import styles from 'app/sak/[saksId]/aktivitet/page.module.css';
import { FigureIcon } from '@navikt/aksel-icons';
import { VilkårsKort } from 'components/vilkårskort/VilkårsKort';
import { Button } from '@navikt/ds-react';

interface FormFields {
  begrunnelse: string;
  grunn?: string;
  dato?: Date;
}
export default function Page() {
  const { form, formFields } = useConfigForm<FormFields>({
    begrunnelse: {
      type: 'textarea',
      label: 'Begrunnelse',
      description:
        'Skriv begrunnelse og henvis til kilde/dokumentasjon. Hvorfor er det ikke rimelig grunn til fraværet?',
      rules: { required: 'Du må begrunne' },
    },
    grunn: {
      type: 'checkbox',
      label: 'Årsak',
      options: [
        'Ikke møtt til møte med Nav',
        'Ikke møtt i behandling eller utredning',
        'Ikke møtt i tiltak',
        'Bruker har ikke sendt inn dokumentasjon som Nav har bedt om',
      ],
    },
    dato: {
      type: 'date',
      label: 'Dato for fravær',
    },
  });
  const buttonText = 'Send inn';
  return (
    <div className={styles.aktivitetSkjema}>
      <VilkårsKort
        heading={'Registrer fravær'}
        steg={'FATTE_VEDTAK'}
        vilkårTilhørerNavKontor={true}
        icon={<FigureIcon fontSize={'inherit'} />}
      >
        <form className={styles.form}>
          <FormField form={form} formField={formFields.dato} />
          <FormField form={form} formField={formFields.grunn} />
          <FormField form={form} formField={formFields.begrunnelse} />
          <Button className={'fit-content-button'}>{buttonText}</Button>
        </form>
      </VilkårsKort>
    </div>
  );
}
