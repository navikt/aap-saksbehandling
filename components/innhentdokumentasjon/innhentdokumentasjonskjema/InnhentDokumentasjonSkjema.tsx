import { FormField, useConfigForm, ValuePair } from '@navikt/aap-felles-react';
import { Alert, Button, Heading } from '@navikt/ds-react';
import { FormEvent, useState } from 'react';

import styles from './InnhentDokumentasjonSkjema.module.css';
import { BestillLegeerklæring } from 'lib/types/types';
import { useBehandlingsReferanse, useSaksnummer } from 'hooks/BehandlingHook';
import { clientSøkPåBehandler } from 'lib/clientApi';
import { Forhåndsvisning } from 'components/innhentdokumentasjon/innhentdokumentasjonskjema/Forhåndsvisning';
import { useBestillDialogmelding } from 'hooks/FetchHook';
import { AsyncComboSearch } from 'components/input/asynccombosearch/AsyncComboSearch';

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
  hprId?: string;
};

type FormFields = {
  behandler: ValuePair;
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
  const [visModal, setVisModal] = useState<boolean>(false);
  const [visBestillingsfeil, setVisBestillingsfeil] = useState<boolean>(false);
  const saksnummer = useSaksnummer();
  const behandlingsreferanse = useBehandlingsReferanse();

  const { bestillDialogmelding, isLoading, error } = useBestillDialogmelding();

  const { form, formFields } = useConfigForm<FormFields>({
    behandler: {
      type: 'async_combobox',
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
    form.handleSubmit(async (data) => {
      const body: BestillLegeerklæring = {
        behandlerNavn: data.behandler.label,
        behandlerRef: data.behandler.value,
        behandlerHprNr: 'Hva skal dette være?', //TODO Hva skal dette være?
        dokumentasjonType: data.dokumentasjonstype,
        fritekst: data.melding,
        saksnummer: saksnummer,
        behandlingsReferanse: behandlingsreferanse,
        veilederNavn: 'Hvor henter jeg denne fra?',
      };
      bestillDialogmelding(body);
      if (!error) {
        onSuccess();
      } else {
        setVisBestillingsfeil(true);
      }
    })(event);
  };

  const forhåndsvis = async () => {
    const validationResult = await form.trigger(); // force validation
    if (validationResult) {
      setVisModal(true);
    }
  };

  const behandlersøk = async (input: string) => {
    const resultat = await clientSøkPåBehandler(input);
    if (!resultat) {
      return [];
    }
    return resultat.map((behandler) => ({ label: formaterBehandlernavn(behandler), value: behandler.behandlerRef }));
  };

  return (
    <div className={'flex-column'}>
      <Heading level={'3'} size={'small'}>
        Etterspør informasjon fra lege
      </Heading>
      <form onSubmit={handleSubmit} className={'flex-column'}>
        <AsyncComboSearch
          label={'Velg behandler som skal motta meldingen'}
          form={form}
          name={'behandler'}
          fetcher={behandlersøk}
          rules={{ required: 'Du må velge en behandler' }}
        />
        <FormField form={form} formField={formFields.dokumentasjonstype} />
        <FormField form={form} formField={formFields.melding} />
        <div className={styles.rad}>
          <Button size={'small'} loading={isLoading}>
            Send dialogmelding
          </Button>
          <Button size={'small'} variant="secondary" type="button" onClick={forhåndsvis} disabled={isLoading}>
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
          <Button variant="tertiary" type="button" onClick={onCancel} size={'small'} disabled={isLoading}>
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
    </div>
  );
};
