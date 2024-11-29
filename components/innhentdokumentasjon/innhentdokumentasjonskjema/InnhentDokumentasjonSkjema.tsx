import { FormField, useConfigForm } from '@navikt/aap-felles-react';
import { Alert, Button, Heading } from '@navikt/ds-react';
import { FormEvent, useState } from 'react';

import styles from './InnhentDokumentasjonSkjema.module.css';
import { BestillLegeerklæring } from 'lib/types/types';
import { useBehandlingsReferanse, useSaksnummer } from 'hooks/BehandlingHook';
import { clientBestillDialogmelding, clientSøkPåBehandler } from 'lib/clientApi';
import { Forhåndsvisning } from 'components/innhentdokumentasjon/innhentdokumentasjonskjema/Forhåndsvisning';
import { ComboSearch } from 'components/input/combosearch/ComboSearch';

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
  onSuccess: () => void;
}

export const formaterBehandlernavn = (behandler: Behandler): string => {
  if (behandler.mellomnavn) {
    return `${behandler.fornavn} ${behandler.mellomnavn} ${behandler.etternavn}`;
  }
  return `${behandler.fornavn} ${behandler.etternavn}`;
};

export const InnhentDokumentasjonSkjema = ({ onCancel, onSuccess }: Props) => {
  const [valgtBehandler, setValgtBehandler] = useState<Behandler>();
  const [behandlerError, setBehandlerError] = useState<string>();
  const [visModal, setVisModal] = useState<boolean>(false);
  const [visBestillingsfeil, setVisBestillingsfeil] = useState<boolean>(false);
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
      options: [
        { label: 'Velg dokumentasjonstype', value: '' },
        { label: 'Tilleggsopplysninger (L8)', value: 'L8' },
        { label: 'Legeerklæring ved arbeidsuførhet (L40)', value: 'L40' },
      ],
      rules: { required: 'Du må velge hvilken type dokumentasjon som skal bestilles' },
    },
    melding: {
      type: 'textarea',
      label: 'Melding',
      rules: { required: 'Du må skrive en melding til behandler' },
    },
  });

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    setVisBestillingsfeil(false);
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
        const res = await clientBestillDialogmelding(body);
        if (res) {
          onSuccess();
        } else {
          setVisBestillingsfeil(true);
        }
      })(event);
    }
  };

  const velgEnBehandler = (behandler?: Behandler) => {
    setBehandlerError(undefined);
    setValgtBehandler(behandler);
  };

  const forhåndsvis = async () => {
    const validationResult = await form.trigger(); // force validation
    if (!valgtBehandler) {
      setBehandlerError('Du må velge en behandler');
    }
    if (validationResult && valgtBehandler) {
      setVisModal(true);
    }
  };

  return (
    <>
      <Heading level={'3'} size={'small'}>
        Etterspør informasjon fra lege
      </Heading>
      {/*<Behandlersøk velgBehandler={velgEnBehandler} behandlerError={behandlerError} />*/}
      <ComboSearch
        label={'Behandler'}
        searchAsString={(behandler: Behandler) => formaterBehandlernavn(behandler)}
        fetcher={clientSøkPåBehandler}
        setValue={velgEnBehandler}
        error={behandlerError}
      />

      <form onSubmit={handleSubmit}>
        <FormField form={form} formField={formFields.dokumentasjonstype} />
        <FormField form={form} formField={formFields.melding} />
        <div className={styles.rad}>
          <Button size={'small'}>Send dialogmelding</Button>
          <Button size={'small'} variant="secondary" type="button" onClick={forhåndsvis}>
            Forhåndsvis
          </Button>
          {visModal && (
            <Forhåndsvisning
              saksnummer={saksnummer}
              fritekst={form.getValues('melding')}
              dokumentasjonsType={form.getValues('dokumentasjonstype')}
              veilederNavn={'Hvor henter jeg denne fra?'}
              visModal={visModal}
              onClose={() => setVisModal(false)}
            />
          )}
          <Button variant="tertiary" type="button" onClick={onCancel} size={'small'}>
            Avbryt
          </Button>
        </div>
        {visBestillingsfeil && (
          <div className={styles.rad}>
            <Alert variant="error" size={'small'}>
              Noe gikk galt ved bestilling av dialogmelding
            </Alert>
          </div>
        )}
      </form>
    </>
  );
};
