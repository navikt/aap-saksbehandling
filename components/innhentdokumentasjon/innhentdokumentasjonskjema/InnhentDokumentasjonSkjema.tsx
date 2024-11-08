import { FormField, useConfigForm } from '@navikt/aap-felles-react';
import { Button, Heading, Search } from '@navikt/ds-react';
import { FormEvent, useState } from 'react';

import styles from './InnhentDokumentasjonSkjema.module.css';
import { søkPåBehandler } from 'lib/clientApi';

export type Behandler = {
  type?: string;
  behandlerRef: string;
  fnr?: string;
  fornavn: string;
  mellomnavn?: string;
  etternavn: string;
  orgnummer?: string;
  kontor?: string;
  adresse?: string;
  postnummer?: string;
  poststed?: string;
  telefon?: string;
};

export type BehandleroppslagResponse = {
  behandlere: Behandler[];
};

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

interface Props {
  onCancel: () => void;
}

export const InnhentDokumentasjonSkjema = ({ onCancel }: Props) => {
  const [behandlere, setBehandlere] = useState<BehandleroppslagResponse>();
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

  const handleSearch = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const value = event.currentTarget.searchit.value;
    if (value && value.length >= 3) {
      const res = await søkPåBehandler(value);
      setBehandlere(res);
    }
  };

  return (
    <>
      <Heading level={'3'} size={'small'}>
        Etterspør informasjon fra lege
      </Heading>
      <form role="search" onSubmit={handleSearch}>
        <Search name="searchit" label="Velg behandler som skal motta meldingen" variant="secondary" size={'small'} />
      </form>
      {behandlere?.behandlere && behandlere.behandlere.length > 0 && (
        <div>
          {behandlere.behandlere.map((behandler) => (
            <div key={behandler.behandlerRef}>
              {behandler.fornavn} {behandler.etternavn}
            </div>
          ))}
        </div>
      )}
      <form onSubmit={handleSubmit}>
        <FormField form={form} formField={formFields.behandler} />
        <FormField form={form} formField={formFields.dokumentasjonstype} />
        <FormField form={form} formField={formFields.melding} />
        <div className={styles.rad}>
          <Button size={'small'}>Send dialogmelding</Button>
          <Button variant="secondary" type="button" size={'small'}>
            Forhåndsvis
          </Button>
          <Button variant="tertiary" type="button" onClick={onCancel} size={'small'}>
            Avbryt
          </Button>
        </div>
      </form>
    </>
  );
};
