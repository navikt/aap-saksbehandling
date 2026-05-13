import { Alert, BodyShort, Button, Detail, Dialog, HStack, Link, VStack } from '@navikt/ds-react';
import { useEffect, useState } from 'react';
import { FormProvider } from 'react-hook-form';

import { useConfigForm } from 'components/form/FormHook';
import { FormField } from 'components/form/FormField';
import { UtfyllingKalender } from 'components/saksoversikt/meldekortoversikt/utfyllingkalender/UtfyllingKalender';
import { FormErrorSummary } from 'components/formerrorsummary/FormErrorSummary';
import { hentFeilmeldingerForForm } from 'lib/utils/formerrors';
import { hentUkeNummerForPeriode } from 'components/saksoversikt/meldekortoversikt/meldekorttabell/MeldekortTabell';
import { Dato } from 'lib/types/Dato';
import { MeldeperiodeMedMeldekortDto } from 'lib/types/types';
import { formaterDatoForBackend, formaterDatoForFrontend } from 'lib/utils/date';
import { clientKorrigerMeldekort } from 'lib/clientApi';
import { useParamsMedType } from 'hooks/saksbehandling/BehandlingHook';
import { isError } from 'lib/utils/api';
import { useAlleDokumenterPåSak } from 'hooks/saksbehandling/DokumenterHook';
import { ExternalLinkIcon } from '@navikt/aksel-icons';
import { addDays } from 'date-fns';

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
  const { dokumenter } = useAlleDokumenterPåSak();

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

  const tidligereInnsendteMeldekort = meldekort.tidligereMeldekort.map((tidligereMeldekort) => {
    const dokument = dokumenter?.find((doku) => doku.journalpostId === tidligereMeldekort.journalpostId);
    const jorunalPostId = tidligereMeldekort.journalpostId;
    const dokumentId = dokument?.dokumenter[0].dokumentInfoId;
    const mottattTidspunkt = tidligereMeldekort.mottattTidspunkt;
    const oppdatertAv = tidligereMeldekort.oppdatertAv;

    return {
      jorunalPostId,
      dokumentId,
      mottattTidspunkt,
      oppdatertAv,
    };
  });

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen} size={'medium'}>
      <Dialog.Popup width={'large'} closeOnOutsideClick={false}>
        <Dialog.Header>
          <Dialog.Title>{`Endre meldekort for uke ${hentUkeNummerForPeriode(fom.dato, tom.dato)}`}</Dialog.Title>
          <Dialog.Description>{`${fom.formaterForFrontend()} - ${tom.formaterForFrontend()}`}</Dialog.Description>
        </Dialog.Header>
        <Dialog.Body>
          <VStack gap={'space-16'}>
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
                      Overstyring av bruker er ikke støttet enda. Hvis behovet vedvarer etter dialog med bruker, send
                      sak i porten til team AAP.
                    </Alert>
                  )}
                </VStack>
              </form>
            </FormProvider>

            {tidligereInnsendteMeldekort && tidligereInnsendteMeldekort.length > 0 && (
              <VStack gap={'space-8'}>
                <BodyShort weight={'semibold'}>Tidligere versjoner av meldekortet:</BodyShort>
                <VStack gap={'space-2'}>
                  {tidligereInnsendteMeldekort.map((tidligereMeldekort, index) => {
                    return (
                      <HStack key={index} gap={'space-4'} align={'baseline'}>
                        <Link
                          href={`/saksbehandling/api/dokumenter/${tidligereMeldekort.jorunalPostId}/${tidligereMeldekort.dokumentId}`}
                          target="_blank"
                        >
                          Meldekort for uke {hentUkeNummerForPeriode(fom.dato, tom.dato)}
                          <ExternalLinkIcon />
                        </Link>
                        <Detail>
                          {formaterDatoForFrontend(tidligereMeldekort.mottattTidspunkt)}{' '}
                          {tidligereMeldekort.oppdatertAv}
                        </Detail>
                      </HStack>
                    );
                  })}
                </VStack>
              </VStack>
            )}
          </VStack>
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

  const eksisterendeDager = meldekort.meldekort?.dager ?? [];

  const startDato = new Date(meldekort.meldeperiode.fom);

  const alleDager: Dag[] = Array.from({ length: 14 }).map((_, index) => {
    const dato = formaterDatoForBackend(addDays(startDato, index));

    const eksisterendeDag = eksisterendeDager.find((dag) => dag.dato === dato);
    return {
      dato,
      timerArbeidet:
        eksisterendeDag?.timerArbeidet == null || eksisterendeDag.timerArbeidet === 0
          ? ''
          : eksisterendeDag.timerArbeidet.toString(),
    };
  });

  return {
    begrunnelse: '',
    årsak: '',
    meldedato: meldekort.meldekort?.mottattTidspunkt
      ? formaterDatoForFrontend(meldekort.meldekort.mottattTidspunkt)
      : '',
    dager: alleDager,
  };
}
