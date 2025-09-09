'use client';

import { Alert, BodyLong, Box, Button, HStack, Page, VStack } from '@navikt/ds-react';
import { OppfølgingsoppgaveV0 } from 'lib/types/types';
import { useConfigForm } from 'components/form/FormHook';
import { FormField } from 'components/form/FormField';
import { clientSendHendelse } from 'lib/clientApi';
import { useState } from 'react';
import { Spinner } from 'components/felles/Spinner';
import { useRouter } from 'next/navigation';
import { isSuccess } from 'lib/utils/api';
import { formaterDatoForBackend } from 'lib/utils/date';
import { v4 as uuid } from 'uuid';
import { parse } from 'date-fns';
import { BrukerInformasjon } from 'lib/services/azure/azureUserService';
import { erDatoIFremtiden, validerDato } from 'lib/validation/dateValidation';
import { Behovstype } from 'lib/utils/form';

interface Props {
  saksnummer: string;
  brukerInformasjon: BrukerInformasjon;
  modalOnClose?: () => void;
  successfullOpprettelse?: () => void;
  finnTidligsteVirkningstidspunkt?: string;
  behandlingsreferanse?: string;
  behovsType?: Behovstype;
}

interface DefaultValues {
  datoForOppfølging: string;
  hvaSkalFølgesOpp: string;
  hvemSkalFølgeOpp: string;
  reserverTilMeg: string[];
}

export interface OppfølgingsoppgaveFormFields {
  datoForOppfølging: string;
  hvaSkalFølgesOpp: string;
  hvemSkalFølgeOpp: 'NasjonalEnhet' | 'Lokalkontor';
  reserverTilMeg: string[];
}

export const OpprettOppfølgingsBehandling = ({
  saksnummer,
  brukerInformasjon,
  modalOnClose,
  successfullOpprettelse,
  finnTidligsteVirkningstidspunkt,
  behandlingsreferanse,
  behovsType,
}: Props) => {
  const defaultValues: DefaultValues = {
    datoForOppfølging: finnTidligsteVirkningstidspunkt ? finnTidligsteVirkningstidspunkt : '',
    hvaSkalFølgesOpp: modalOnClose ? 'Vurder virkningstidspunkt etter samordning' : '',
    hvemSkalFølgeOpp: modalOnClose ? 'NasjonalEnhet' : '',
    reserverTilMeg: modalOnClose ? [] : ['RESERVER_TIL_MEG'],
  };

  const router = useRouter();

  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string>();

  const avbrytButton = (modalOnClose?: () => void) =>
    modalOnClose ? modalOnClose() : router.push(`/saksbehandling/sak/${saksnummer}`);

  async function sendHendelse(data: OppfølgingsoppgaveFormFields) {
    const innsending = {
      saksnummer: saksnummer,
      referanse: {
        type: 'BEHANDLING_REFERANSE',
        verdi: uuid(),
      },
      type: 'OPPFØLGINGSOPPGAVE',
      kanal: 'DIGITAL',
      mottattTidspunkt: new Date().toISOString(),
      melding: {
        meldingType: 'OppfølgingsoppgaveV0',
        opprinnelse: {
          behandlingsreferanse: behandlingsreferanse,
          avklaringsbehovKode: behovsType,
        },
        datoForOppfølging: formaterDatoForBackend(parse(data.datoForOppfølging, 'dd.MM.yyyy', new Date())),
        hvaSkalFølgesOpp: data.hvaSkalFølgesOpp,
        reserverTilBruker: data.reserverTilMeg.length > 0 ? brukerInformasjon.NAVident : undefined,
        hvemSkalFølgeOpp: data.hvemSkalFølgeOpp,
      } satisfies OppfølgingsoppgaveV0,
    };

    setIsLoading(true);

    const res = await clientSendHendelse(saksnummer, innsending);

    if (isSuccess(res)) {
      setIsLoading(false);
      if (modalOnClose && successfullOpprettelse) {
        successfullOpprettelse?.();
        modalOnClose();
      } else {
        router.push(`/saksbehandling/sak/${saksnummer}`);
      }
    } else {
      setError(res.apiException.message);
    }
  }

  const { form, formFields } = useConfigForm<OppfølgingsoppgaveFormFields>({
    datoForOppfølging: {
      type: 'date_input',
      label: 'Dato for oppfølging',
      defaultValue: defaultValues.datoForOppfølging,
      rules: {
        required: 'Dato for oppfølging kan ikke må settes.',
        validate: (value) => {
          const valideringsresultat = validerDato(value as string);
          if (valideringsresultat) {
            return valideringsresultat;
          }

          if (!erDatoIFremtiden(value as string)) {
            return 'Datoen kan ikke være tilbake i tid.';
          }
        },
      },
    },
    hvemSkalFølgeOpp: {
      type: 'combobox',
      label: 'Hvem følger opp?',
      defaultValue: defaultValues.hvemSkalFølgeOpp,
      options: [
        {
          label: 'NAY',
          value: 'NasjonalEnhet',
        },
        { label: 'Lokalkontor', value: 'Lokalkontor' },
      ],
      rules: { required: 'Må sette hvem som skal følge opp.' },
    },
    reserverTilMeg: {
      type: 'checkbox',
      options: [{ label: 'Reserver oppgaven til meg', value: 'RESERVER_TIL_MEG' }],
      defaultValue: defaultValues.reserverTilMeg,
    },
    hvaSkalFølgesOpp: {
      type: 'textarea',
      label: 'Hva skal følges opp?',
      defaultValue: defaultValues.hvaSkalFølgesOpp,
    },
  });

  if (isLoading) {
    return <Spinner label="Oppretter oppfølgingsoppgave ..." />;
  }

  return (
    <Page.Block width="md">
      <form onSubmit={form.handleSubmit((data) => sendHendelse(data))}>
        <VStack gap="4">
          <Box>
            <VStack gap="4">
              <div>
                <BodyLong>Oppfølgingsoppgaven ligger på vent til ønsket dato.</BodyLong>
              </div>
              <FormField form={form} formField={formFields.datoForOppfølging} size="medium" />
              <FormField form={form} formField={formFields.hvaSkalFølgesOpp} size="medium" />
              <FormField form={form} formField={formFields.hvemSkalFølgeOpp} size="medium" />
              <FormField form={form} formField={formFields.reserverTilMeg} size="medium" />
            </VStack>
          </Box>

          {error && (
            <Alert variant={'error'} size={'small'}>
              {error}
            </Alert>
          )}

          <HStack gap="4">
            <Button type="submit">Bekreft</Button>
            <Button type="button" variant="secondary" onClick={() => avbrytButton(modalOnClose)}>
              Avbryt
            </Button>
          </HStack>
        </VStack>
      </form>
    </Page.Block>
  );
};
