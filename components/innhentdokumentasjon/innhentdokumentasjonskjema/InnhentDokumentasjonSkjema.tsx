import { Alert, BodyShort, Button, Heading, Link } from '@navikt/ds-react';
import { FormEvent, useState } from 'react';

import styles from './InnhentDokumentasjonSkjema.module.css';
import { BestillLegeerklæring } from 'lib/types/types';
import { useBehandlingsReferanse, useSaksnummer } from 'hooks/saksbehandling/BehandlingHook';
import { clientBestillDialogmelding, clientSøkPåBehandler } from 'lib/clientApi';
import { Forhåndsvisning } from 'components/innhentdokumentasjon/innhentdokumentasjonskjema/Forhåndsvisning';
import { AsyncComboSearch } from 'components/form/asynccombosearch/AsyncComboSearch';
import { useConfigForm } from 'components/form/FormHook';
import { FormField, ValuePair } from 'components/form/FormField';
import { isError } from 'lib/utils/api';
import { ExternalLinkIcon } from '@navikt/aksel-icons';

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
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string>();
  const [defaultOptions, setDefaultOptions] = useState<ValuePair[]>([]);
  const saksnummer = useSaksnummer();
  const behandlingsreferanse = useBehandlingsReferanse();

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
        behandlerRef: data.behandler.value.split('::')[0],
        behandlerHprNr: data.behandler.value.split('::')[1],
        dokumentasjonType: data.dokumentasjonstype,
        fritekst: data.melding,
        saksnummer: saksnummer,
        behandlingsReferanse: behandlingsreferanse,
      };

      const manglerHprNr =
        body.behandlerHprNr === undefined || body.behandlerHprNr === null || body.behandlerHprNr === 'null';

      if (manglerHprNr) {
        setError(': Mangler HPR-nr på behandler');
        return;
      }
      setIsLoading(true);
      const result = await clientBestillDialogmelding(body).finally(() => setIsLoading(false));

      if (isError(result)) {
        setError(result.apiException.message);
      } else {
        onSuccess();
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
    if (input.length <= 2 || input.length > 40) {
      return [];
    }
    const response = await clientSøkPåBehandler(input, saksnummer);
    if (isError(response)) {
      return [];
    }
    const res = response.data.map((behandler) => ({
      label: `${formaterBehandlernavn(behandler)} - ${behandler.kontor}`,
      value: `${behandler.behandlerRef}::${behandler.hprId}`,
    }));
    setDefaultOptions(res);
    return res;
  };

  return (
    <div className={'flex-column'}>
      <Heading level={'3'} size={'small'}>
        Be om opplysninger fra behandler
      </Heading>
      <Link
        href={
          'https://navno.sharepoint.com/sites/fag-og-ytelser-radgivende-legetjeneste/SitePages/Felles-rutine-for-innhenting-av-helseopplysninger.aspx?&xsdata=MDV8MDJ8fGIwNWFkNTJkZjczMTQzNjhiNTg5MDhkZTY4N2Y1MzAzfDYyMzY2NTM0MWVjMzQ5NjI4ODY5OWI1NTM1Mjc5ZDBifDB8MHw2MzkwNjMwOTMxOTYwNzY0MjV8VW5rbm93bnxWR1ZoYlhOVFpXTjFjbWwwZVZObGNuWnBZMlY4ZXlKRFFTSTZJbFJsWVcxelgwRlVVRk5sY25acFkyVmZVMUJQVEU5R0lpd2lWaUk2SWpBdU1DNHdNREF3SWl3aVVDSTZJbGRwYmpNeUlpd2lRVTRpT2lKUGRHaGxjaUlzSWxkVUlqb3hNWDA9fDF8TDJOb1lYUnpMekU1T20xbFpYUnBibWRmV2tSVmQxbDZUWGxOUkVGMFRXcFZNRmw1TURCTmFteHRURlJuZWs5WFVYUk9SMUV5V2xSa2ExbFhWVFZPZWtwcVFIUm9jbVZoWkM1Mk1pOXRaWE56WVdkbGN5OHhOemN3TnpFeU5URTNPRFF4fDg3ZDNjODMyYWZjNjRjZjk1MzQxMDhkZTY4N2Y1MzAxfDViMjBjYjYwZGEyODQ2ZDU4NjI1MDIzYzQ1YWFjNTdk&sdata=TktPbXp3NHJQU0hMOFRJS0dUTUxpaEFYZkoyRnA0RHNWcWNMcThtRXhaMD0%3D'
        }
        target={'_blank'}
      >
        <BodyShort size={'small'}>Rutiner for innhenting av helseopplysninger</BodyShort>
        <ExternalLinkIcon />
      </Link>
      <form onSubmit={handleSubmit} className={'flex-column'} autoComplete={'off'}>
        <AsyncComboSearch
          label={'Velg behandler som skal motta meldingen'}
          form={form}
          name={'behandler'}
          fetcher={behandlersøk}
          rules={{ required: 'Du må velge en behandler' }}
          size={'small'}
          defaultOptions={defaultOptions}
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
              visModal={visModal}
              onClose={() => setVisModal(false)}
            />
          )}
          <Button size={'small'} variant="tertiary" type="button" onClick={onCancel} disabled={isLoading}>
            Avbryt
          </Button>
        </div>
        {error && (
          <div className={styles.rad}>
            <Alert variant="error" size={'small'}>
              {error || 'Noe gikk galt ved bestilling av dialogmelding'}
            </Alert>
          </div>
        )}
      </form>
    </div>
  );
};
