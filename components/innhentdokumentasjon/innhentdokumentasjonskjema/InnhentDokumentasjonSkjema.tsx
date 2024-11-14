import { FormField, useConfigForm } from '@navikt/aap-felles-react';
import { Button, Heading } from '@navikt/ds-react';
import { FormEvent, useState } from 'react';

import styles from './InnhentDokumentasjonSkjema.module.css';
import { BestillLegeerklæring } from 'lib/types/types';
import { useBehandlingsReferanse, useSaksnummer } from 'hooks/BehandlingHook';
import { Behandlersøk } from 'components/innhentdokumentasjon/innhentdokumentasjonskjema/Behandlersøk';
import { bestillDialogmelding } from 'lib/clientApi';

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

type FormFields = {
  behandler: string;
  dokumentasjonstype: 'L8' | 'L40';
  melding: string;
};

interface Props {
  onCancel: () => void;
}

export const formaterBehandlernavn = (behandler: Behandler): string => {
  if (behandler.mellomnavn) {
    return `${behandler.fornavn} ${behandler.mellomnavn} ${behandler.etternavn}`;
  }
  return `${behandler.fornavn} ${behandler.etternavn}`;
};

export const InnhentDokumentasjonSkjema = ({ onCancel }: Props) => {
  const [valgtBehandler, setValgtBehandler] = useState<Behandler>();
  const [behandlerError, setBehandlerError] = useState<string>();
  const saksnummer = useSaksnummer();
  const behandlingsreferanse = useBehandlingsReferanse();

  const { form, formFields } = useConfigForm<FormFields>({
    behandler: {
      type: 'text',
      label: 'Velg behandler som skal motta meldingen',
      rules: { required: 'Du må velge hvilke(n) behandler som skal motta meldingen' },
    },
    dokumentasjonstype: {
      type: 'select',
      label: 'Type dokumentasjon',
      options: ['', 'L8', 'L40'],
      rules: { required: 'Du må velge hvilken type dokumentasjon som skal bestilles' },
    },
    melding: {
      type: 'textarea',
      label: 'Melding',
      rules: { required: 'Du må skrive en melding til behandler' },
    },
  });

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    setBehandlerError(undefined);
    if (!valgtBehandler) {
      event.preventDefault();
      setBehandlerError('Du må velge en behandler');
      form.trigger();
    } else {
      form.handleSubmit(async (data) => {
        const body: BestillLegeerklæring = {
          behandlerNavn: formaterBehandlernavn(valgtBehandler),
          behandlerRef: valgtBehandler.behandlerRef,
          dokumentasjonType: data.dokumentasjonstype,
          fritekst: data.melding,
          saksnummer: saksnummer,
          behandlingsReferanse: behandlingsreferanse,
          veilederNavn: 'Hvor henter jeg denne fra?',
        };
        await bestillDialogmelding(body);
      })(event);
    }
  };

  const velgEnBehandler = (behandler?: Behandler) => {
    setBehandlerError(undefined);
    setValgtBehandler(behandler);
  };

  return (
    <>
      <Heading level={'3'} size={'small'}>
        Etterspør informasjon fra lege
      </Heading>
      <Behandlersøk velgBehandler={velgEnBehandler} behandlerError={behandlerError} />
      <form onSubmit={handleSubmit}>
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
