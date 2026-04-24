import { Alert, Button, Dialog, VStack } from '@navikt/ds-react';
import { useEffect } from 'react';
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

const årsakOptions = ['', 'Registrere meldedato', 'Lever/endre meldekort for bruker', 'Overstyre bruker'];

export const RedigerMeldekortModal = ({ isOpen, setIsOpen, meldekort }: Props) => {
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

  const skalViseMeldedato = årsak === 'Lever/endre meldekort for bruker' || årsak === 'Registrere meldedato';
  const skalViseTimer = årsak === 'Lever/endre meldekort for bruker';
  const skalViseAlertForOverstyringAvBruker = årsak === 'Overstyre bruker';

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
              onSubmit={form.handleSubmit(() => {
                // TODO POST endring her
                setIsOpen(false);
              })}
            >
              <VStack gap={"space-16"}>
                <FormField form={form} formField={formFields.begrunnelse} />
                <FormField form={form} formField={formFields.årsak} />
                {skalViseMeldedato && <FormField form={form} formField={formFields.meldedato} />}
                {skalViseTimer && <UtfyllingKalender />}
                <FormErrorSummary errorList={errorList} />
                {skalViseAlertForOverstyringAvBruker && (
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
          <Button form={'endre-meldekort'}>Bekreft</Button>
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
