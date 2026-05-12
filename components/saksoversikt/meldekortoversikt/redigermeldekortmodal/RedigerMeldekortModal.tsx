import { Alert, Button, Dialog, VStack } from '@navikt/ds-react';
import { useEffect, useState } from 'react';
import { FormProvider } from 'react-hook-form';

import { useConfigForm } from 'components/form/FormHook';
import { FormField } from 'components/form/FormField';
import { UtfyllingKalender } from 'components/saksoversikt/meldekortoversikt/utfyllingkalender/UtfyllingKalender';
import { FormErrorSummary } from 'components/formerrorsummary/FormErrorSummary';
import { hentFeilmeldingerForForm } from 'lib/utils/formerrors';
import { hentUkeNummerForPeriode } from 'components/saksoversikt/meldekortoversikt/meldekorttabell/MeldekortTabell';
import { Dato } from 'lib/types/Dato';
import { MeldeperiodeMedMeldekortDto, Periode } from 'lib/types/types';
import { formaterDatoForBackend } from 'lib/utils/date';
import { clientKorrigerMeldekort } from 'lib/clientApi';
import { useParamsMedType } from 'hooks/saksbehandling/BehandlingHook';
import { isError } from 'lib/utils/api';

interface Props {
  setIsOpen: (isOpen: boolean) => void;
  isOpen: boolean;
  meldekort?: MeldeperiodeMedMeldekortDto;
}

export interface RedigerMeldekortFormFields {
  begrunnelse: string;
  årsak: string;
  meldedato: string;
  dager: Dag[];
}

interface Dag {
  dato: string;
  timerArbeidet: string;
}

enum Årsaker {
  REGISTRERE_MELDEDATO = 'Registrere meldedato',
  LEVERE_MELDEKORT_FOR_BRUKER = 'Lever/endre meldekort for bruker',
  OVERSTYRE_BRUKER = 'Overstyre bruker',
}

const årsakOptions = ['', ...Object.values(Årsaker)];

export const RedigerMeldekortModal = ({ isOpen, setIsOpen, meldekort }: Props) => {
  const { saksnummer } = useParamsMedType();

  const [error, setError] = useState<string>();
  const [isLoading, setIsLoading] = useState(false);

  const defaultValues = getDefaultValuesForForm(meldekort);

  const { form, formFields } = useConfigForm<RedigerMeldekortFormFields>({
    begrunnelse: {
      type: 'textarea',
      label: 'Begrunnelse',
      description: 'Hvorfor gjør du endring, og hva er kilden til informasjonen.',
      defaultValue: defaultValues?.begrunnelse,
      rules: { required: 'Du må skrive en begrunnelse for hvorfor du gjør endring.' },
    },
    årsak: {
      type: 'select',
      options: årsakOptions,
      label: 'Årsak',
      defaultValue: defaultValues?.årsak,
      rules: {
        validate: (value) => {
          if (value === 'Overstyre bruker') {
            return 'Overstyring av bruker støttes ikke ennå.';
          }
        },
      },
    },
    meldedato: {
      type: 'date_input',
      label: 'Meldedato',
      description: 'Meldekortet regnes som levert på denne datoen.',
      defaultValue: defaultValues?.meldedato,
    },
    dager: {
      type: 'fieldArray',
      defaultValue: defaultValues?.dager,
    },
  });

  useEffect(() => {
    if (isOpen && meldekort) {
      form.reset(getDefaultValuesForForm(meldekort));
    }
  }, [isOpen, meldekort]);

  if (!meldekort) {
    return null;
  }

  const fom = new Dato(meldekort.meldeperiode.fom);
  const tom = new Dato(meldekort.meldeperiode.tom);

  const errorList = hentFeilmeldingerForForm(form.formState.errors);

  const årsak = form.watch('årsak');

  const erÅrsakLevereMeldekort = årsak === Årsaker.LEVERE_MELDEKORT_FOR_BRUKER;
  const erÅrsakRegistrereMeldedato = årsak === Årsaker.REGISTRERE_MELDEDATO;
  const erÅrsakOverstyring = årsak === Årsaker.OVERSTYRE_BRUKER;

  const brukerHarLevertTimer = meldekort.meldekort?.dager.some((dag) => dag.timerArbeidet > 0) ?? false;

  const skalViseMeldedato = erÅrsakLevereMeldekort || erÅrsakRegistrereMeldedato;
  const skalViseTimer = erÅrsakLevereMeldekort || (erÅrsakRegistrereMeldedato && brukerHarLevertTimer);
  const skalViseAlertForIngenTimer = erÅrsakRegistrereMeldedato && !brukerHarLevertTimer;

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen} size={'medium'}>
      <Dialog.Popup width={'large'} closeOnOutsideClick={false}>
        <Dialog.Header>
          <Dialog.Title>{`Endre meldekort for uke ${hentUkeNummerForPeriode(fom.dato, tom.dato)}`}</Dialog.Title>
          <Dialog.Description>{`${fom.formaterForFrontend()} - ${tom.formaterForFrontend()}`}</Dialog.Description>
        </Dialog.Header>
        <Dialog.Body>
          <FormProvider {...form}>
            <form
              id={'endre-meldekort'}
              onSubmit={form.handleSubmit(async (data) => {
                setIsLoading(true);
                const oppdaterMeldekortResponse = await clientKorrigerMeldekort(saksnummer, {
                  dager: data.dager.map((dag) => {
                    return {
                      dato: dag.dato,
                      timerArbeidet: Number(dag.timerArbeidet),
                    };
                  }),
                  begrunnelse: data.begrunnelse,
                  meldeperiode: meldekort.meldeperiode,
                });

                if (isError(oppdaterMeldekortResponse)) {
                  setError('Noe gikk galt ved oppdatering av meldekort.');
                } else {
                  setIsOpen(false);
                }

                setIsLoading(false);
              })}
            >
              <VStack gap={'space-16'}>
                <FormField form={form} formField={formFields.begrunnelse} />
                <FormField form={form} formField={formFields.årsak} />
                {skalViseMeldedato && <FormField form={form} formField={formFields.meldedato} />}
                {skalViseTimer && <UtfyllingKalender readOnly={erÅrsakRegistrereMeldedato} />}
                {skalViseAlertForIngenTimer && (
                  <Alert variant={'info'} size={'small'}>
                    Bruker har ikke levert noen timer.
                  </Alert>
                )}
                <FormErrorSummary errorList={errorList} />
                {error && <Alert variant={'error'}>{error}</Alert>}
                {erÅrsakOverstyring && (
                  <Alert variant={'warning'} size={'small'}>
                    Overstyring av bruker er ikke støttet enda. Hvis behovet vedvarer etter dialog med bruker, send sak
                    i porten til team AAP.
                  </Alert>
                )}
              </VStack>
            </form>
          </FormProvider>
        </Dialog.Body>
        <Dialog.Footer>
          <Dialog.CloseTrigger>
            <Button variant="secondary">Avbryt</Button>
          </Dialog.CloseTrigger>
          <Button form={'endre-meldekort'} loading={isLoading}>
            Bekreft
          </Button>
        </Dialog.Footer>
      </Dialog.Popup>
    </Dialog>
  );
};

function getDefaultValuesForForm(meldekort?: MeldeperiodeMedMeldekortDto): RedigerMeldekortFormFields | undefined {
  if (!meldekort) {
    return undefined;
  }

  return {
    begrunnelse: '',
    årsak: '',
    meldedato: '',
    dager:
      meldekort?.meldekort?.dager.map((dag) => ({
        dato: dag.dato,
        timerArbeidet: dag.timerArbeidet == null || dag.timerArbeidet === 0 ? '' : dag.timerArbeidet.toString(),
      })) || genererUkedagerFraMeldeperiode(meldekort.meldeperiode),
  };
}

function genererUkedagerFraMeldeperiode(meldeperiode: Periode): Dag[] {
  return Array.from({ length: 14 }).map((_, i) => {
    const currentDate = new Dato(meldeperiode.fom).dato;
    currentDate.setDate(currentDate.getDate() + i);

    return {
      dato: formaterDatoForBackend(currentDate),
      timerArbeidet: '',
    };
  });
}
