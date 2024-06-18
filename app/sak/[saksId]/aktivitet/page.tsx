'use client';

import { useConfigForm } from 'hooks/FormHook';
import { FormField, ValuePair } from 'components/input/formfield/FormField';
import styles from 'app/sak/[saksId]/aktivitet/page.module.css';
import { FigureIcon } from '@navikt/aksel-icons';
import { VilkårsKort } from 'components/vilkårskort/VilkårsKort';
import { Button } from '@navikt/ds-react';
import { useEffect, useState } from 'react';
import { AktivitetsTabell } from 'components/aktivitetstabell/AktivitetsTabell';
import { sendAktivitetClient } from 'lib/clientApi';
import { AktivitetDtoType } from 'lib/types/types';
import { formaterDatoForBackend } from 'lib/utils/date';

interface FormFields {
  begrunnelse: string;
  grunn?: string;
  dato?: Date;
}
export const grunnOptions: ValuePair<AktivitetDtoType>[] = [
  { label: 'Ikke møtt til møte med Nav', value: 'IKKE_MØTT_TIL_MØTE' },
  { label: 'Ikke møtt i behandling eller utredning', value: 'IKKE_MØTT_TIL_BEHANDLING' },
  { label: 'Ikke møtt i tiltak', value: 'IKKE_MØTT_TIL_TILTAK' },
  { label: 'Ikke møtt til annen fastsatt aktivitet', value: 'IKKE_MØTT_TIL_ANNEN_AKTIVITET' },
  {
    label: 'Bruker har ikke sendt inn dokumentasjon som Nav har bedt om',
    value: 'IKKE_SENDT_INN_DOKUMENTASJON',
  },
  { label: 'Bidrar ikke aktivt i prosessen med å komme seg i arbeid', value: 'IKKE_AKTIVT_BIDRAG' },
] as const;
type Årsaker = (typeof grunnOptions)[number]['label'];

export default function Page({ params }: { params: { saksId: string } }) {
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
      options: grunnOptions.map((e) => e.label),
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
        <AktivitetsTabell />
        <form
          className={styles.form}
          onSubmit={form.handleSubmit(async (data) => {
            const type = grunnOptions.find((e) => e.label === data.grunn)?.value;
            const dato = data.dato && formaterDatoForBackend(data.dato);
            if (!type || !dato) return;
            await sendAktivitetClient({
              hammer: {
                dato,
                type,
              },
              saksnummer: params.saksId,
            });
          })}
        >
          <FormField form={form} formField={formFields.grunn} />
          {valgtÅrsak && <FormField form={form} formField={formFields.begrunnelse} />}
          {valgtÅrsak && <FormField form={form} formField={{ ...formFields.dato, label: datoLabel }} />}
          <Button className={'fit-content-button'}>{buttonText}</Button>
        </form>
      </VilkårsKort>
    </div>
  );
}
