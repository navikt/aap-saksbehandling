'use client';

import { useConfigForm } from 'hooks/FormHook';
import { FormField } from 'components/input/formfield/FormField';
import styles from 'app/sak/[saksId]/aktivitet/page.module.css';
import { FigureIcon } from '@navikt/aksel-icons';
import { VilkårsKort } from 'components/vilkårskort/VilkårsKort';
import { Button } from '@navikt/ds-react';
import { useEffect, useState } from 'react';
type Årsaker =
  | 'Ikke møtt til møte med Nav'
  | 'Ikke møtt i behandling eller utredning'
  | 'Ikke møtt i tiltak'
  | 'Ikke møtt til annen fastsatt aktivitet'
  | 'Bruker har ikke sendt inn dokumentasjon som Nav har bedt om'
  | 'Bidrar ikke aktivt i prosessen med å komme seg i arbeid';

interface FormFields {
  begrunnelse: string;
  grunn?: string;
  dato?: Date;
}
export default function Page() {
  const [datoLabel, setDatoLabel] = useState<string>('');
  const { form, formFields } = useConfigForm<FormFields>({
    begrunnelse: {
      type: 'textarea',
      label: 'Begrunnelse',
      description:
        'Skriv begrunnelse og henvis til kilde/dokumentasjon. Hvorfor er det ikke rimelig grunn til fraværet?',
      rules: { required: 'Du må begrunne' },
    },
    grunn: {
      type: 'radio',
      label: 'Årsak',
      options: [
        'Ikke møtt til møte med Nav',
        'Ikke møtt i behandling eller utredning',
        'Ikke møtt i tiltak',
        'Ikke møtt til annen fastsatt aktivitet',
        'Bruker har ikke sendt inn dokumentasjon som Nav har bedt om',
        'Bidrar ikke aktivt i prosessen med å komme seg i arbeid',
      ],
    },
    dato: {
      type: 'date',
      label: 'Dato for fravær',
    },
  });
  const valgtÅrsak = form.watch('grunn');
  useEffect(() => {
    if (valgtÅrsak) {
      switch (valgtÅrsak as Årsaker) {
        case 'Bidrar ikke aktivt i prosessen med å komme seg i arbeid': {
          setDatoLabel('Dato for opphør');
          return;
        }
        case 'Bruker har ikke sendt inn dokumentasjon som Nav har bedt om': {
          setDatoLabel('Frist for innsending av dokumentasjon');
          return;
        }
        default: {
          setDatoLabel('Dato for fravær');
        }
      }
    }
  }, [valgtÅrsak]);
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
          <FormField form={form} formField={formFields.grunn} />
          {valgtÅrsak && <FormField form={form} formField={formFields.begrunnelse} />}
          {valgtÅrsak && <FormField form={form} formField={{ ...formFields.dato, label: datoLabel }} />}
          <Button className={'fit-content-button'}>{buttonText}</Button>
        </form>
      </VilkårsKort>
    </div>
  );
}
