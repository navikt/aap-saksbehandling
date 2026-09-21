import { Button, Dialog, VStack } from '@navikt/ds-react';
import { useState } from 'react';
import { Dato } from 'lib/types/Dato';
import { clientRegistrerMeldedato } from 'lib/clientApi';
import { useParamsMedType } from 'hooks/saksbehandling/BehandlingHook';
import { isError } from 'lib/utils/api';
import { useMeldekort } from 'hooks/saksbehandling/MeldekortHook';
import { erDatoIFremtiden } from 'lib/validation/dateValidation';
import { Alert } from 'components/alert/Alert';
import { useConfigForm } from 'components/form/FormHook';
import { FormField } from 'components/form/FormField';

interface Props {
  isOpen: boolean;
  setIsOpen: (isOpen: boolean) => void;
}

export interface RegistrerMeldedatoFormFields {
  begrunnelse: string;
  meldedato: string;
}

const defaultValues: RegistrerMeldedatoFormFields = {
  begrunnelse: '',
  meldedato: '',
};

export const RegistrerMeldedatoModal = ({ isOpen, setIsOpen }: Props) => {
  const { saksnummer } = useParamsMedType();
  const { refetchMeldekort } = useMeldekort();

  const [error, setError] = useState<string>();
  const [isLoading, setIsLoading] = useState(false);

  const { formFields, form } = useConfigForm<RegistrerMeldedatoFormFields>({
    begrunnelse: {
      type: 'textarea',
      label: 'Hvordan meldte brukeren seg til Nav?',
      rules: { required: 'Du må skrive en begrunnelse for hvorfor du registrerer meldedato.' },
    },
    meldedato: {
      type: 'date_input',
      label: 'Dato brukeren meldte seg for Nav',
      description: 'Meldeplikt regnes som oppfylt på denne datoen',
      rules: {
        required: 'Du må legge til en dato brukeren meldte seg på annet vis.',
        validate: {
          validerIkkeIFremtiden: (value) => {
            if (erDatoIFremtiden(value)) {
              return 'Meldedato kan ikke være i fremtiden.';
            }
          },
        },
      },
    },
  });

  const lukkOgNullstill = () => {
    setIsOpen(false);
    setIsLoading(false);
    setError(undefined);
    form.reset(defaultValues);
  };

  return (
    <Dialog
      open={isOpen}
      onOpenChange={(open) => {
        if (!open) {
          lukkOgNullstill();
        }
      }}
      size={'medium'}
    >
      <Dialog.Popup width={'medium'} closeOnOutsideClick={false}>
        <Dialog.Header>
          <Dialog.Title>Registrer at brukeren har meldt seg på annet vis enn meldekort</Dialog.Title>
        </Dialog.Header>
        <Dialog.Body>
          <VStack gap={'space-16'}>
            <form
              id={'registrer-meldedato'}
              onSubmit={form.handleSubmit(async (data) => {
                setIsLoading(true);
                const registrerMeldedatoResponse = await clientRegistrerMeldedato(saksnummer, {
                  begrunnelse: data.begrunnelse,
                  meldeDato: new Dato(data.meldedato).formaterForBackend(),
                });

                if (isError(registrerMeldedatoResponse)) {
                  setError('Noe gikk galt ved innsending: ' + registrerMeldedatoResponse.apiException.message);
                  setIsLoading(false);
                } else {
                  refetchMeldekort();
                }
              })}
            >
              <VStack gap={'space-16'}>
                <FormField form={form} formField={formFields.begrunnelse} />
                <FormField form={form} formField={formFields.meldedato} />
                <Alert variant={'warning'}>
                  Du skal kun legge inn faktisk dato brukeren har meldt seg. Hvis det skal vurderes om det er rimelig
                  grunn til at brukeren ikke har meldt seg, så må du opprette revurdering på § 11-10 Overstyr perioder
                  uten oppfylt meldeplikt. Meldt dato kan ikke angres etter bekreftelse
                </Alert>
                {error && <Alert variant={'error'}>{error}</Alert>}
              </VStack>
            </form>
          </VStack>
        </Dialog.Body>
        <Dialog.Footer>
          <Dialog.CloseTrigger>
            <Button variant="secondary">Avbryt</Button>
          </Dialog.CloseTrigger>
          <Button form={'registrer-meldedato'} loading={isLoading}>
            Bekreft
          </Button>
        </Dialog.Footer>
      </Dialog.Popup>
    </Dialog>
  );
};
