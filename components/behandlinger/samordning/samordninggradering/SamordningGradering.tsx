'use client';

import { MellomlagretVurdering, Periode, SamordningGraderingGrunnlag, SamordningYtelsestype } from 'lib/types/types';
import { useLøsBehovOgGåTilNesteSteg } from 'hooks/saksbehandling/LøsBehovOgGåTilNesteStegHook';
import { Alert, BodyLong, Box, Button, Detail, Heading, HStack, Modal, VStack } from '@navikt/ds-react';
import { FormEvent, useRef, useState } from 'react';
import { useConfigForm } from 'components/form/FormHook';
import { FormField } from 'components/form/FormField';
import { useBehandlingsReferanse } from 'hooks/saksbehandling/BehandlingHook';
import { Behovstype } from 'lib/utils/form';
import { formaterDatoForBackend, formaterDatoForFrontend } from 'lib/utils/date';
import { addDays, format, isValid, parse } from 'date-fns';
import { YtelseTabell } from 'components/behandlinger/samordning/samordninggradering/YtelseTabell';
import { validerDato } from 'lib/validation/dateValidation';

import styles from 'components/behandlinger/samordning/samordninggradering/SamordningGradering.module.css';
import { Ytelsesvurderinger } from 'components/behandlinger/samordning/samordninggradering/Ytelsesvurderinger';
import { VilkårskortMedFormOgMellomlagring } from 'components/vilkårskort/vilkårskortmedformogmellomlagring/VilkårskortMedFormOgMellomlagring';
import { isNullOrUndefined } from 'lib/utils/validering';
import { useMellomlagring } from 'hooks/saksbehandling/MellomlagringHook';
import { OpprettOppfølgingsBehandling } from 'components/saksoversikt/opprettoppfølgingsbehandling/OpprettOppfølgingsbehandling';
import { useSak } from 'hooks/SakHook';
import { BrukerInformasjon } from 'lib/services/azure/azureUserService';

interface Props {
  bruker: BrukerInformasjon;
  grunnlag: SamordningGraderingGrunnlag;
  behandlingVersjon: number;
  readOnly: boolean;
  initialMellomlagretVurdering?: MellomlagretVurdering;
}

interface SamordnetYtelse {
  ytelseType?: SamordningYtelsestype;
  kilde: string;
  manuell?: boolean;
  graderingFraKilde?: number;
  gradering?: number;
  kronseum?: number;
  periode: Periode;
}

export interface SamordningGraderingFormfields {
  begrunnelse: string;
  maksDatoEndelig: string;
  fristNyRevurdering?: string;
  vurderteSamordninger: SamordnetYtelse[];
}

type DraftFormFields = Partial<SamordningGraderingFormfields>;

export const SamordningGradering = ({
  bruker,
  grunnlag,
  behandlingVersjon,
  readOnly,
  initialMellomlagretVurdering,
}: Props) => {
  const behandlingsreferanse = useBehandlingsReferanse();
  const [errorMessage, setErrorMessage] = useState<String | undefined>(undefined);
  const [success, setSuccess] = useState(false);

  const handleSuccess = () => {
    setSuccess(true);
  };

  const finnesYtelserEllerVurderinger = !!(
    grunnlag.ytelser.length > 0 ||
    (grunnlag.vurdering && grunnlag.vurdering?.vurderinger?.length > 0)
  );

  const [visForm, setVisForm] = useState<boolean>(finnesYtelserEllerVurderinger);

  const defaultValue: DraftFormFields = initialMellomlagretVurdering
    ? JSON.parse(initialMellomlagretVurdering.data)
    : mapVurderingToDraftFormFields(grunnlag);

  const { form, formFields } = useConfigForm<SamordningGraderingFormfields>(
    {
      begrunnelse: {
        type: 'textarea',
        label: 'Vurder utbetalingsgrad for folketrygdytelser',
        rules: { required: 'Du må gjøre en vilkårsvurdering' },
        defaultValue: defaultValue.begrunnelse,
      },
      maksDatoEndelig: {
        type: 'radio',
        label: 'Skal virkningstidspunkt revurderes nærmere?',
        options: [
          { label: 'Ja, virkningstidspunkt må vurderes på nytt', value: 'false' },
          { label: 'Nei, virkningstidspunkt er bekreftet', value: 'true' },
        ],
        rules: { required: 'Du må ta stilling til om virkningstidspunkt er endelig' },
        defaultValue: defaultValue.maksDatoEndelig,
      },
      fristNyRevurdering: {
        type: 'date_input',
        label: 'Sett dato for ny revurdering',
        rules: {
          required: 'Du må sette en dato for revurdering',
          validate: {
            gyldigDato: (v) => validerDato(v as string),
          },
        },
        defaultValue: defaultValue.fristNyRevurdering,
      },
      vurderteSamordninger: {
        type: 'fieldArray',
        defaultValue: defaultValue.vurderteSamordninger,
      },
    },
    { readOnly: readOnly, shouldUnregister: true }
  );

  const { løsBehovOgGåTilNesteSteg, status, isLoading, løsBehovOgGåTilNesteStegError } =
    useLøsBehovOgGåTilNesteSteg('SAMORDNING_GRADERING');

  const { mellomlagretVurdering, lagreMellomlagring, nullstillMellomlagretVurdering, slettMellomlagring } =
    useMellomlagring(Behovstype.AVKLAR_SAMORDNING_GRADERING, initialMellomlagretVurdering);

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    form.handleSubmit(async (data) => {
      setErrorMessage(undefined);
      if (grunnlag.ytelser.length > 0 && data.vurderteSamordninger.length === 0) {
        setErrorMessage('Du må gjøre en vurdering av periodene');
      } else {
        return løsBehovOgGåTilNesteSteg(
          {
            behandlingVersjon: behandlingVersjon,
            behov: {
              behovstype: Behovstype.AVKLAR_SAMORDNING_GRADERING,
              vurderingerForSamordning: {
                begrunnelse: data.begrunnelse,
                maksDatoEndelig: data.maksDatoEndelig !== 'false',
                fristNyRevurdering:
                  data.fristNyRevurdering &&
                  formaterDatoForBackend(parse(data.fristNyRevurdering, 'dd.MM.yyyy', new Date())),
                vurderteSamordningerData: (data.vurderteSamordninger || []).map((vurdertSamordning) => ({
                  manuell: vurdertSamordning.manuell,
                  gradering: vurdertSamordning.gradering,
                  periode: {
                    fom: formaterDatoForBackend(parse(vurdertSamordning.periode.fom, 'dd.MM.yyyy', new Date())),
                    tom: formaterDatoForBackend(parse(vurdertSamordning.periode.tom, 'dd.MM.yyyy', new Date())),
                  },
                  ytelseType: vurdertSamordning.ytelseType!,
                })),
              },
            },
            referanse: behandlingsreferanse,
          },
          () => nullstillMellomlagretVurdering()
        );
      }
    })(event);
  };

  const samordninger = form.watch('vurderteSamordninger')?.map((vurdering) => vurdering.gradering);

  const visRevurderVirkningstidspunkt = samordninger?.some((verdi) => Number(verdi) === 100);

  const finnTidligsteVirkningstidspunkt = () => {
    const alleTomDatoer = form
      .getValues('vurderteSamordninger')
      .filter((vurdering) => !!vurdering.periode.tom)
      .filter((vurdering) => vurdering.gradering == 100)
      .map((vurdert) => parse(vurdert.periode.tom, 'dd.MM.yyyy', new Date()))
      .filter((dato) => isValid(dato));

    if (!alleTomDatoer.length) {
      return undefined;
    }

    const senesteDato = Math.max(...alleTomDatoer.map((e) => e.getTime()));
    return format(addDays(new Date(senesteDato), 1), 'dd.MM.yyyy');
  };

  const sak = useSak();
  const [visModalForOppfølgingsoppgaveState, setModalForOppfølgingsoppgaveState] = useState<boolean>(false);
  const ref = useRef<HTMLDialogElement>(null);

  return (
    <>
      {bruker && visModalForOppfølgingsoppgaveState && (
        <Modal
          ref={ref}
          header={{ heading: 'Opprett oppfølgningsoppgave' }}
          onClose={() => setModalForOppfølgingsoppgaveState(false)}
          open={true}
        >
          <Modal.Body>
            <OpprettOppfølgingsBehandling
              saksnummer={sak.sak.saksnummer}
              brukerInformasjon={bruker}
              modalOnClose={() => setModalForOppfølgingsoppgaveState(false)}
              successfullOpprettelse={handleSuccess}
              finnTidligsteVirkningstidspunkt={finnTidligsteVirkningstidspunkt()}
            />
          </Modal.Body>
        </Modal>
      )}
      <VilkårskortMedFormOgMellomlagring
        heading="§§ 11-27 / 11-28 Samordning med andre folketrygdytelser"
        steg="SAMORDNING_GRADERING"
        onSubmit={handleSubmit}
        isLoading={isLoading}
        status={status}
        visBekreftKnapp={!readOnly}
        løsBehovOgGåTilNesteStegError={løsBehovOgGåTilNesteStegError}
        vilkårTilhørerNavKontor={false}
        vurdertAvAnsatt={grunnlag.vurdering?.vurdertAv}
        readOnly={readOnly}
        onLagreMellomLagringClick={() => lagreMellomlagring(form.watch())}
        onDeleteMellomlagringClick={() => {
          slettMellomlagring(() =>
            form.reset(grunnlag.vurdering ? mapVurderingToDraftFormFields(grunnlag) : emptyDraftFormFields())
          );
        }}
        mellomlagretVurdering={mellomlagretVurdering}
      >
        {visForm && (
          <VStack gap={'6'}>
            <FormField form={form} formField={formFields.begrunnelse} className="begrunnelse" />
            <YtelseTabell ytelser={grunnlag.ytelser} />
            <Ytelsesvurderinger form={form} readOnly={readOnly} />
            {success && (
              <Box maxWidth={'80ch'}>
                <Alert variant="success">Oppfølgingsoppgave opprettet</Alert>
              </Box>
            )}
            {visRevurderVirkningstidspunkt && !success && (
              <Box maxWidth={'90ch'}>
                <Alert variant="info">
                  <Heading spacing size="small" level="3">
                    Tidligste virkningstidspunkt etter samordning er{' '}
                    <strong>{finnTidligsteVirkningstidspunkt()}</strong>
                  </Heading>
                  <VStack gap={'2'}>
                    <BodyLong size="small">
                      Kelvin oppretter automatisk revurdering hvis det kommer vedtak om folketrygdytelse som går utover
                      denne perioden, eller hvis graden i vedtaket endres.
                    </BodyLong>
                    <BodyLong size="small">
                      Hvis det er andre årsaker til at virkningstidspunktet bør vurderes igjen, så kan du opprette en
                      oppfølgingsoppgave
                    </BodyLong>

                    <Button
                      size={'small'}
                      type={'button'}
                      variant={'secondary'}
                      onClick={() => {
                        setModalForOppfølgingsoppgaveState(true);
                      }}
                      className={styles.OpprettOppfølgingsoppgaveBtn}
                    >
                      Opprett oppfølgingsoppgave
                    </Button>
                  </VStack>
                </Alert>
              </Box>
            )}
            {errorMessage && <Alert variant={'error'}>{errorMessage}</Alert>}
          </VStack>
        )}
        {!visForm && (
          <VStack gap={'2'}>
            <Detail>Vi finner ingen ytelser fra folketrygden</Detail>
            <HStack>
              <Button
                size={'small'}
                type={'button'}
                variant={'secondary'}
                onClick={() => setVisForm(true)}
                disabled={readOnly}
              >
                Legg til folketrygdytelse
              </Button>
            </HStack>
          </VStack>
        )}
      </VilkårskortMedFormOgMellomlagring>
    </>
  );
};

function mapVurderingToDraftFormFields(grunnlag: SamordningGraderingGrunnlag): DraftFormFields {
  return {
    begrunnelse: grunnlag.vurdering?.begrunnelse || undefined,
    fristNyRevurdering:
      (grunnlag.vurdering?.fristNyRevurdering && formaterDatoForFrontend(grunnlag.vurdering?.fristNyRevurdering)) ||
      undefined,
    maksDatoEndelig:
      grunnlag.vurdering?.maksDatoEndelig === undefined || grunnlag.vurdering?.maksDatoEndelig === null
        ? undefined
        : grunnlag.vurdering?.maksDatoEndelig.toString(),
    vurderteSamordninger: grunnlag.vurdering?.vurderinger.map((ytelse) => ({
      ytelseType: ytelse.ytelseType,
      kilde: '',
      graderingFraKilde: undefined,
      gradering: !isNullOrUndefined(ytelse.gradering) ? ytelse.gradering : undefined,
      manuell: ytelse.manuell || undefined,
      periode: {
        fom: format(new Date(ytelse.periode.fom), 'dd.MM.yyyy'),
        tom: format(new Date(ytelse.periode.tom), 'dd.MM.yyyy'),
      },
    })),
  };
}

function emptyDraftFormFields(): DraftFormFields {
  return {
    begrunnelse: '',
    fristNyRevurdering: '',
    maksDatoEndelig: '',
    vurderteSamordninger: [],
  };
}
