'use client';

import { VilkårsKort } from 'components/vilkårskort/VilkårsKort';
import { FigureIcon } from '@navikt/aksel-icons';
import { AktivitetsTabell } from 'components/aktivitetstabell/AktivitetsTabell';
import styles from 'app/sak/[saksId]/aktivitet/page.module.css';
import { formaterDatoForBackend } from 'lib/utils/date';
import { sendAktivitetClient } from 'lib/clientApi';
import { FormField, useConfigForm, ValuePair } from '@navikt/aap-felles-react';
import { Button } from '@navikt/ds-react';
import { AktivitetDtoType, Aktivitetsmeldinger } from 'lib/types/types';

interface Props {
  saksnummer: string;
  aktivitetsMeldinger: Aktivitetsmeldinger;
}
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

export const AktivitetsMelding = ({ saksnummer, aktivitetsMeldinger }: Props) => {
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

  function hentDatoLabel(valgtÅrsak: string): string {
    switch (valgtÅrsak) {
      case 'Bidrar ikke aktivt i prosessen med å komme seg i arbeid': {
        return 'Dato for opphør';
      }
      case 'Bruker har ikke sendt inn dokumentasjon som Nav har bedt om': {
        return 'Frist for innsending av dokumentasjon';
      }
      default: {
        return 'Dato for fravær';
      }
    }
  }

  return (
    <VilkårsKort
      heading={'Registrer fravær'}
      steg={'FATTE_VEDTAK'}
      vilkårTilhørerNavKontor={true}
      icon={<FigureIcon fontSize={'inherit'} />}
    >
      <AktivitetsTabell aktivitetsmeldinger={aktivitetsMeldinger} />
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
              begrunnelse: data.begrunnelse,
            },
            saksnummer,
          });
        })}
      >
        <FormField form={form} formField={formFields.grunn} />
        {valgtÅrsak && <FormField form={form} formField={formFields.begrunnelse} />}
        {valgtÅrsak && <FormField form={form} formField={{ ...formFields.dato, label: hentDatoLabel(valgtÅrsak) }} />}
        <Button className={'fit-content-button'}>Send inn</Button>
      </form>
    </VilkårsKort>
  );
};
