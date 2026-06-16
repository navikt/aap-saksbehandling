import { BodyShort, Button, Detail, Dialog, HStack, Link, VStack } from '@navikt/ds-react';
import { useEffect, useState } from 'react';
import { FormProvider, useForm } from 'react-hook-form';
import { UtfyllingKalender } from 'components/saksoversikt/meldekortoversikt/utfyllingkalender/UtfyllingKalender';
import { FormErrorSummary } from 'components/formerrorsummary/FormErrorSummary';
import { hentFeilmeldingerForForm } from 'lib/utils/formerrors';
import { hentUkeNummerForPeriode } from 'components/saksoversikt/meldekortoversikt/meldekorttabell/MeldekortTabell';
import { Dato } from 'lib/types/Dato';
import { MeldeperiodeMedMeldekortDto, OppdaterMeldekortRequest } from 'lib/types/types';
import { formaterDatoForBackend, formaterDatoForFrontend } from 'lib/utils/date';
import { clientKorrigerMeldekort } from 'lib/clientApi';
import { useParamsMedType } from 'hooks/saksbehandling/BehandlingHook';
import { isError } from 'lib/utils/api';
import { useAlleDokumenterPåSak } from 'hooks/saksbehandling/DokumenterHook';
import { ExternalLinkIcon } from '@navikt/aksel-icons';
import { MeldekortProsesseringServerSentEvent } from 'app/saksbehandling/api/meldekort/[saksnummer]/prosessering/route';
import { addDays, differenceInDays } from 'date-fns';
import { useMeldekort } from 'hooks/saksbehandling/MeldekortHook';
import { Journalpost } from 'lib/types/journalpost';
import { erDatoFoerDato, erDatoIFremtiden } from 'lib/validation/dateValidation';
import { Alert } from 'components/alert/Alert';
import { DateInputWrapper } from 'components/form/dateinputwrapper/DateInputWrapper';
import { SelectWrapper } from 'components/form/selectwrapper/SelectWrapper';
import { Option } from 'react-day-picker';
import { TextAreaWrapper } from 'components/form/textareawrapper/TextAreaWrapper';

interface Props {
  setIsOpen: (isOpen: boolean) => void;
  isOpen: boolean;
  meldekort?: MeldeperiodeMedMeldekortDto;
}

export interface RedigerMeldekortFormFields {
  begrunnelse: string;
  årsak: Årsaker;
  meldedato: string;
  dager: Dag[];
}

interface Dag {
  dato: string;
  timerArbeidet: string;
}

export enum Årsaker {
  REGISTRERE_MELDEDATO = 'Registrere at bruker har meldt seg',
  LEVERE_MELDEKORT_FOR_BRUKER = 'Lever/endre meldekort for bruker',
  OVERSTYRE_BRUKER = 'Overstyre bruker',
}

const årsakOptions = ['', ...Object.values(Årsaker)];

export const RedigerMeldekortModal = ({ isOpen, setIsOpen, meldekort }: Props) => {
  const { saksnummer } = useParamsMedType();
  const { dokumenter } = useAlleDokumenterPåSak();
  const { refetchMeldekort } = useMeldekort();

  const [error, setError] = useState<string>();
  const [isLoading, setIsLoading] = useState(false);

  const ventPåMeldekortProsessering = () => {
    const eventSource = new EventSource(`/saksbehandling/api/meldekort/${saksnummer}/prosessering/`, {
      withCredentials: true,
    });

    eventSource.onmessage = async (event: MessageEvent) => {
      const eventData: MeldekortProsesseringServerSentEvent = JSON.parse(event.data);

      if (eventData.status === 'KLAR') {
        eventSource.close();
        refetchMeldekort();
        setIsOpen(false);
        setIsLoading(false);
      } else {
        eventSource.close();
        setError('Meldekort ble sendt inn, men prosesseringen tok for lang tid. Prøv å laste siden på nytt.');
        setIsLoading(false);
      }
    };

    eventSource.onerror = () => {
      eventSource.close();
      setError('Noe gikk galt under prosessering av meldekort.');
      setIsLoading(false);
    };
  };

  const form = useForm({ defaultValues: getDefaultValuesForForm(meldekort) });

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

  const årsak = form.getValues('årsak');

  const erÅrsakLevereMeldekort = årsak === Årsaker.LEVERE_MELDEKORT_FOR_BRUKER;
  const erÅrsakRegistrereMeldedato = årsak === Årsaker.REGISTRERE_MELDEDATO;
  const erÅrsakOverstyring = årsak === Årsaker.OVERSTYRE_BRUKER;

  const brukerHarLevertTimer = meldekort.meldekort?.dager.some((dag) => dag.timerArbeidet > 0) ?? false;

  const skalViseMeldedato = erÅrsakLevereMeldekort || erÅrsakRegistrereMeldedato;
  const skalViseTimer = erÅrsakLevereMeldekort || (erÅrsakRegistrereMeldedato && brukerHarLevertTimer);
  const skalViseAlertForIngenTimer = erÅrsakRegistrereMeldedato && !brukerHarLevertTimer;
  const meldeDatoLabel =
    årsak === Årsaker.REGISTRERE_MELDEDATO ? 'Dato brukeren meldte seg for Nav' : 'Dato brukeren meldte opplysningene';

  const tidligereInnsendteMeldekort = kobleDokumentInfoTilTidligereMeldekort(meldekort, dokumenter);
  const errorList = hentFeilmeldingerForForm(form.formState.errors);

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
                  const oppdaterMeldekortResponse = await clientKorrigerMeldekort(
                    saksnummer,
                    mapFormDataTilOppdaterMeldekortRequest(data, meldekort.meldeperiode)
                  );

                  if (isError(oppdaterMeldekortResponse)) {
                    setError('Noe gikk galt ved innsending: ' + oppdaterMeldekortResponse.apiException.message);
                    setIsLoading(false);
                  } else {
                    ventPåMeldekortProsessering();
                  }
                })}
              >
                <VStack gap={'space-16'}>
                  <TextAreaWrapper
                    name={'begrunnelse'}
                    control={form.control}
                    label={'Begrunnelse'}
                    description={'Hvorfor gjør du endring, og hva er kilden til informasjonen.'}
                    rules={{ required: 'Du må skrive en begrunnelse for hvorfor du gjør endring.' }}
                  />
                  <SelectWrapper
                    control={form.control}
                    name={'årsak'}
                    label={'Årsak'}
                    rules={{
                      validate: (value) => {
                        if (value === 'Overstyre bruker') {
                          return 'Overstyring av bruker støttes ikke ennå.';
                        }
                      },
                    }}
                  >
                    {årsakOptions.map((årsak, index) => (
                      <Option key={index}>{årsak}</Option>
                    ))}
                  </SelectWrapper>
                  {skalViseMeldedato && (
                    <DateInputWrapper
                      control={form.control}
                      name={'meldedato'}
                      label={meldeDatoLabel}
                      rules={{
                        required: 'Du må legge til en meldedato for meldekortet.',
                        validate: {
                          validerIkkeFørDato: (value) => {
                            if (erDatoIFremtiden(value as string)) {
                              return 'Meldedato kan ikke være i fremtiden.';
                            }
                          },
                          validerIkkeFørMeldeperiodeTom: (value) => {
                            const tom = meldekort?.meldeperiode.tom;
                            if (tom) {
                              const dagenEtterTom = formaterDatoForFrontend(addDays(new Date(tom), 1));
                              if (erDatoFoerDato(value as string, dagenEtterTom)) {
                                return `Meldedato må være dagen etter meldeperiodens slutt eller senere.`;
                              }
                            }
                          },
                        },
                      }}
                    />
                  )}
                  {skalViseTimer && <UtfyllingKalender readOnly={erÅrsakRegistrereMeldedato} />}
                  {skalViseAlertForIngenTimer && (
                    <Alert variant={'info'}>
                      Bruker har ikke levert noen timer. Det vil ikke gå noen utbetaling før bruker registrerer timer i
                      meldekortet.
                    </Alert>
                  )}
                  <FormErrorSummary errorList={errorList} />
                  {error && <Alert variant={'error'}>{error}</Alert>}
                  {erÅrsakOverstyring && (
                    <Alert variant={'warning'}>
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
                        {tidligereMeldekort.dokumentId && (
                          <Link
                            href={`/saksbehandling/api/dokumenter/${tidligereMeldekort.journalpostId}/${tidligereMeldekort.dokumentId}`}
                            target="_blank"
                          >
                            Meldekort for uke {hentUkeNummerForPeriode(fom.dato, tom.dato)}
                            <ExternalLinkIcon />
                          </Link>
                        )}
                        <Detail>
                          {formaterDatoForFrontend(tidligereMeldekort.meldeDato)} {tidligereMeldekort.oppdatertAv}
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

  if (!meldekort.periode) {
    return undefined;
  }

  const eksisterendeDager = meldekort.meldekort?.dager ?? [];
  const startDato = new Dato(meldekort.periode.fom);
  const sluttDato = new Dato(meldekort.periode.tom);
  const antallDager = differenceInDays(sluttDato.dato, startDato.dato) + 1; // +1 for å inkludere tom dato

  const alleDager: Dag[] = Array.from({ length: antallDager }).map((_, index) => {
    const dato = formaterDatoForBackend(addDays(startDato.dato, index));
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
    årsak: '' as Årsaker,
    meldedato: meldekort.meldekort?.meldeDato ? formaterDatoForFrontend(meldekort.meldekort.meldeDato) : '',
    dager: alleDager,
  };
}

function kobleDokumentInfoTilTidligereMeldekort(
  meldeperiodeMedMeldekort: MeldeperiodeMedMeldekortDto,
  dokumenter?: Journalpost[]
) {
  return meldeperiodeMedMeldekort.tidligereMeldekort.map((tidligereMeldekort) => {
    const dokument = dokumenter?.find((doku) => doku.journalpostId === tidligereMeldekort.journalpostId);
    const journalpostId = tidligereMeldekort.journalpostId;
    const dokumentId = dokument?.dokumenter[0]?.dokumentInfoId;
    const meldeDato = tidligereMeldekort.meldeDato;
    const oppdatertAv = tidligereMeldekort.oppdatertAv;

    return {
      journalpostId,
      dokumentId,
      meldeDato,
      oppdatertAv,
    };
  });
}

export function mapFormDataTilOppdaterMeldekortRequest(
  data: RedigerMeldekortFormFields,
  meldeperiode: MeldeperiodeMedMeldekortDto['meldeperiode']
): OppdaterMeldekortRequest {
  return {
    dager:
      data.årsak === Årsaker.LEVERE_MELDEKORT_FOR_BRUKER
        ? data.dager.map((dag) => ({
            dato: dag.dato,
            timerArbeidet: Number(replaceCommasWithDots(dag.timerArbeidet)),
          }))
        : [],
    meldeDato: new Dato(data.meldedato).formaterForBackend(),
    begrunnelse: data.begrunnelse,
    meldeperiode,
  };
}

export function replaceCommasWithDots(input: string): string {
  return input.replace(/,/g, '.');
}
