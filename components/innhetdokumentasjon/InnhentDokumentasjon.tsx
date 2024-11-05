import { FormField, useConfigForm } from '@navikt/aap-felles-react';
import { Button, Heading } from '@navikt/ds-react';
import { FormEvent, useState } from 'react';

import styles from './InnhentDokumentasjon.module.css';

type FormFields = {
  behandler: string;
  dokumentasjonstype: 'L8' | 'L40';
  melding: string;
};

const mockDocs = [
  { label: 'Dr. Evil', value: 'drEvil' },
  { label: 'Dr. Doom', value: 'drDoom' },
  { label: 'Doogie Houser, M.D.', value: 'doogie' },
];

export const InnhentDokumentasjon = () => {
  const [visSkjema, oppdaterVisSkjema] = useState<boolean>(false);
  const { form, formFields } = useConfigForm<FormFields>({
    behandler: {
      type: 'combobox',
      label: 'Velg behandler som skal motta meldingen',
      options: mockDocs.map((doc) => ({ label: doc.label, value: doc.value })),
      rules: { required: 'Du må velge hvilke(n) behandler som skal motta meldingen' },
    },
    dokumentasjonstype: {
      type: 'select',
      label: 'Type dokumentasjon',
      options: ['L8', 'L40'],
      rules: { required: 'Du må velge hvilken type dokumentasjon som skal bestilles' },
    },
    melding: {
      type: 'textarea',
      label: 'Melding',
      rules: { required: 'Du må skrive en melding til behandler' },
    },
  });

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    form.handleSubmit((data) => {
      console.log(data);
    })(event);
  };

  return (
    <section>
      {!visSkjema && (
        <Button type="button" variant={'secondary'} onClick={() => oppdaterVisSkjema(true)} size={'small'}>
          Etterspør informasjon fra lege
        </Button>
      )}
      {visSkjema && (
        <>
          <Heading level={'3'} size={'small'}>
            Etterspør informasjon fra lege
          </Heading>
          <form onSubmit={handleSubmit}>
            <FormField form={form} formField={formFields.behandler} />
            <FormField form={form} formField={formFields.dokumentasjonstype} />
            <FormField form={form} formField={formFields.melding} />
            <div className={styles.rad}>
              <Button size={'small'}>Send dialogmelding</Button>
              <Button variant="secondary" type="button" size={'small'}>
                Forhåndsvis
              </Button>
              <Button variant="tertiary" type="button" onClick={() => oppdaterVisSkjema(false)} size={'small'}>
                Avbryt
              </Button>
            </div>
          </form>
        </>
      )}
    </section>
  );
};
