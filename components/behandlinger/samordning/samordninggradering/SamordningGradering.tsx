'use client';

import { BodyLong, BodyShort, Box, Button, Heading, HStack, Modal, VStack } from '@navikt/ds-react';
import { addDays, format, isValid, parse } from 'date-fns';
import { useSak } from 'hooks/SakHook';
import { useParamsMedType } from 'hooks/saksbehandling/BehandlingHook';
import { useMellomlagring } from 'hooks/saksbehandling/MellomlagringHook';
import { useVilkårskortVisning } from 'hooks/saksbehandling/visning/VisningHook';
import {
  MellomlagretVurdering,
  OppfølgningOppgaveOpprinnelseResponse,
  Periode,
  SamordningGraderingGrunnlag,
  SamordningGraderingYtelse,
  SamordningYtelsestype,
  SamordningYtelseVurdering,
} from 'lib/types/types';
import { formaterDatoForBackend, formaterDatoForFrontend } from 'lib/utils/date';
import { Behovstype } from 'lib/utils/form';
import { storForbokstavOgMellomromForUnderstrek } from 'lib/utils/string';
import { loggUmamiVarighet, useUmamiStartTidspunkt } from 'lib/utils/umami/varighet';
import { isNullOrUndefined } from 'lib/utils/validering';
import { SubmitEventHandler, useRef, useState } from 'react';
import { useFieldArray } from 'react-hook-form';

import { Alert } from 'components/alert/Alert';
import styles from 'components/behandlinger/samordning/samordninggradering/SamordningGradering.module.css';
import { RelevantInformasjonSamordningGradering } from 'components/behandlinger/samordning/samordninggradering/RelevantInformasjonSamordningGradering';
import { YtelseTabell } from 'components/behandlinger/samordning/samordninggradering/YtelseTabell';
import { Ytelsesvurderinger } from 'components/behandlinger/samordning/samordninggradering/Ytelsesvurderinger';
import { FormField, ValuePair } from 'components/form/FormField';
import { useConfigForm } from 'components/form/FormHook';
import { OpprettOppfølgingsBehandling } from 'components/saksoversikt/opprettoppfølgingsbehandling/OpprettOppfølgingsbehandling';
import { TidligereVurderinger } from 'components/tidligerevurderinger/TidligereVurderinger';
import { Veiledning } from 'components/veiledning/Veiledning';
import { VilkårskortMedFormOgMellomlagring } from 'components/vilkårskort/vilkårskortmedformogmellomlagring/VilkårskortMedFormOgMellomlagring';
import { useLøsAvklaringsbehov } from 'hooks/saksbehandling/løsavklaringsbehov/useLøsAvklaringsbehov';

interface Props {
  grunnlag: SamordningGraderingGrunnlag;
  behandlingVersjon: number;
  readOnly: boolean;
  initialMellomlagretVurdering?: MellomlagretVurdering;
  oppfølgningOppgave?: OppfølgningOppgaveOpprinnelseResponse;
}

interface SamordnetYtelse {
  ytelseType?: SamordningYtelsestype;
  manuell?: boolean;
  gradering?: number;
  periode: Periode;
}

export interface SamordningGraderingFormfields {
  begrunnelse: string;
  vurderteSamordninger: SamordnetYtelse[];
}

type DraftFormFields = Partial<SamordningGraderingFormfields>;

export const SamordningGradering = ({
  grunnlag,
  behandlingVersjon,
  readOnly,
  initialMellomlagretVurdering,
  oppfølgningOppgave,
}: Props) => {
  const { behandlingsreferanse } = useParamsMedType();
  const [errorMessage, setErrorMessage] = useState<string | undefined>(undefined);
  const [success, setSuccess] = useState(false);

  const handleSuccess = () => {
    setSuccess(true);
  };

  const finnesYtelserEllerVurderinger = !!(
    grunnlag.ytelser.length > 0 ||
    (grunnlag.vurdering && grunnlag.vurdering?.vurderinger?.length > 0)
  );

  const [visForm, setVisForm] = useState<boolean>(finnesYtelserEllerVurderinger);

  const { løsAvklaringsbehov, løsAvklaringsbehovStatus, løsAvklaringsbehovIsLoading, løsAvklaringsbehovError } =
    useLøsAvklaringsbehov('SAMORDNING_GRADERING');

  const { visningActions, formReadOnly, visningModus } = useVilkårskortVisning(
    readOnly,
    'SAMORDNING_GRADERING',
    initialMellomlagretVurdering
  );
  const umamiStartTidspunkt = useUmamiStartTidspunkt(visningModus);

  const defaultValue: DraftFormFields = initialMellomlagretVurdering
    ? JSON.parse(initialMellomlagretVurdering.data)
    : mapVurderingToDraftFormFields(grunnlag);

  const { form, formFields } = useConfigForm<SamordningGraderingFormfields>(
    {
      begrunnelse: {
        type: 'textarea',
        label: 'Vurder vilkåret',
        rules: { required: 'Du må gjøre en vilkårsvurdering' },
        defaultValue: defaultValue.begrunnelse,
      },
      vurderteSamordninger: {
        type: 'fieldArray',
        defaultValue: defaultValue.vurderteSamordninger,
      },
    },
    { readOnly: formReadOnly, shouldUnregister: true }
  );

  const { mellomlagretVurdering, nullstillMellomlagretVurdering, slettMellomlagring } = useMellomlagring(
    Behovstype.AVKLAR_SAMORDNING_GRADERING,
    initialMellomlagretVurdering,
    form
  );

  const vurderteSamordningerFieldArray = useFieldArray({
    control: form.control,
    name: 'vurderteSamordninger',
  });

  const kopierYtelserTilVurdering = (ytelser: SamordningGraderingYtelse[]) => {
    vurderteSamordningerFieldArray.append(
      ytelser.map((ytelse) => ({
        manuell: true,
        ytelseType: ytelse.ytelseType,
        gradering: undefined,
        periode: {
          fom: formaterDatoForFrontend(ytelse.periode.fom),
          tom: formaterDatoForFrontend(ytelse.periode.tom),
        },
      }))
    );
  };

  const handleSubmit: SubmitEventHandler = (event) => {
    form.handleSubmit(async (data) => {
      setErrorMessage(undefined);
      if (grunnlag.ytelser.length > 0 && data.vurderteSamordninger.length === 0) {
        setErrorMessage('Du må gjøre en vurdering av periodene');
      } else {
        løsAvklaringsbehov(
          {
            behandlingVersjon: behandlingVersjon,
            behov: {
              behovstype: Behovstype.AVKLAR_SAMORDNING_GRADERING,
              vurderingerForSamordning: {
                begrunnelse: data.begrunnelse,
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
          () => {
            loggUmamiVarighet('STEG_SAMORDNING_GRADERING_VARIGHET', umamiStartTidspunkt, Date.now());
            visningActions.onBekreftClick();
            nullstillMellomlagretVurdering();
          }
        );
      }
    })(event);
  };

  const samordninger = form.watch('vurderteSamordninger')?.map((vurdering) => vurdering.gradering);

  const visRevurderVirkningstidspunkt = samordninger?.some((verdi) => Number(verdi) === 100);

  const historiskeVurderinger = grunnlag.historiskeVurderinger;

  const erAllereddeOppfølgningsOppgave = oppfølgningOppgave && oppfølgningOppgave?.data.length > 0;

  const sak = useSak();
  const rettighetsperiodeFom = parse(sak.sak.periode.fom, 'yyyy-MM-dd', new Date());
  const finnTidligsteVirkningstidspunkt = () =>
    beregnTidligsteVirkningstidspunkt(form.getValues('vurderteSamordninger'), rettighetsperiodeFom);
  const [visModalForOppfølgingsoppgaveState, setModalForOppfølgingsoppgaveState] = useState<boolean>(false);
  const ref = useRef<HTMLDialogElement>(null);

  return (
    <>
      {visModalForOppfølgingsoppgaveState && (
        <Modal
          ref={ref}
          header={{ heading: 'Vurder konsekvens' }}
          onClose={() => setModalForOppfølgingsoppgaveState(false)}
          open={true}
        >
          <Modal.Body>
            <OpprettOppfølgingsBehandling
              behovsType={Behovstype.AVKLAR_SAMORDNING_GRADERING}
              behandlingsreferanse={behandlingsreferanse}
              saksnummer={sak.sak.saksnummer}
              modalOnClose={() => setModalForOppfølgingsoppgaveState(false)}
              successfullOpprettelse={handleSuccess}
              finnTidligsteVirkningstidspunkt={finnTidligsteVirkningstidspunkt()}
            />
          </Modal.Body>
        </Modal>
      )}
      <VilkårskortMedFormOgMellomlagring
        heading="§§ 11-27 / 11-28 Forholdet til andre fulle eller reduserte folketrygdytelser"
        steg="SAMORDNING_GRADERING"
        onSubmit={handleSubmit}
        isLoading={løsAvklaringsbehovIsLoading}
        status={løsAvklaringsbehovStatus}
        løsBehovOgGåTilNesteStegError={løsAvklaringsbehovError}
        vilkårTilhørerNavKontor={false}
        vurderingerMeta={grunnlag.vurdering?.vurderingerMeta}
        onDeleteMellomlagringClick={() => {
          slettMellomlagring(() =>
            form.reset(grunnlag.vurdering ? mapVurderingToDraftFormFields(grunnlag) : emptyDraftFormFields())
          );
        }}
        mellomlagretVurdering={mellomlagretVurdering}
        visningModus={visningModus}
        visningActions={visningActions}
        formReset={() => form.reset(mellomlagretVurdering ? JSON.parse(mellomlagretVurdering.data) : undefined)}
      >
        <RelevantInformasjonSamordningGradering grunnlag={grunnlag} />

        {!!historiskeVurderinger && !!historiskeVurderinger.length && (
          /* TODO: <TidligereVurderinger/> er ikke ideelt for visning av denne typen data (samordning, inst, m.m.).
              Burde på sikt utformes litt annerledes, men dette får fungere som en slags "MVP" */
          <TidligereVurderinger
            data={historiskeVurderinger}
            buildFelter={byggFelter}
            getErGjeldende={() => {
              return true;
            }}
            getFomDato={(v) => v.vurderingerMeta.vurdertAv?.dato ?? ''}
            getVurdertAvIdent={(v) => v.vurderingerMeta.vurdertAv?.ident ?? ''}
            getVurdertDato={(v) => v.vurderingerMeta.vurdertAv?.dato ?? ''}
            grupperPåOpprettetDato={true}
          />
        )}

        {visForm && (
          <VStack gap={'space-24'}>
            <Veiledning
              header={'Hva skal vurderes?'}
              tekst={
                'For sykepenger skal det vurderes om grunnlaget er under 2 G. Det skal redegjøres for vurdert maksdato, inkludert eventuell ferie, og vises til hvor informasjonen er innhentet. Ved avslag på § 11-27 skal det være redegjort for hvorfor det avslås.'
              }
              defaultOpen={false}
            />
            <FormField form={form} formField={formFields.begrunnelse} className="begrunnelse" />
            <YtelseTabell
              ytelser={grunnlag.ytelser}
              readOnly={formReadOnly}
              onKopierYtelser={kopierYtelserTilVurdering}
            />
            <Ytelsesvurderinger form={form} readOnly={formReadOnly} fieldArray={vurderteSamordningerFieldArray} />
            {(success || erAllereddeOppfølgningsOppgave) && (
              <Box maxWidth={'80ch'}>
                <Alert variant="success">Oppfølgingsoppgave opprettet</Alert>
              </Box>
            )}
            {!erAllereddeOppfølgningsOppgave && visRevurderVirkningstidspunkt && !success && (
              <Box maxWidth={'90ch'}>
                <Alert variant="info">
                  <Heading spacing size="small" level="3">
                    Tidligste virkningstidspunkt etter samordning er{' '}
                    <strong>{finnTidligsteVirkningstidspunkt()}</strong>
                  </Heading>
                  <VStack gap={'space-8'}>
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
          <VStack gap={'space-16'}>
            <BodyShort size={'small'}>Vi finner ingen ytelser fra folketrygden</BodyShort>
            {!formReadOnly && (
              <HStack>
                <Button size={'small'} type={'button'} variant={'secondary'} onClick={() => setVisForm(true)}>
                  Legg til folketrygdytelse
                </Button>
              </HStack>
            )}
          </VStack>
        )}
      </VilkårskortMedFormOgMellomlagring>
    </>
  );
};

function mapVurderingToDraftFormFields(grunnlag: SamordningGraderingGrunnlag): DraftFormFields {
  return {
    begrunnelse: grunnlag.vurdering?.begrunnelse || undefined,
    vurderteSamordninger: grunnlag.vurdering?.vurderinger.map((ytelse) => ({
      ytelseType: ytelse.ytelseType,
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
    vurderteSamordninger: [],
  };
}

function byggFelter(vurdering: SamordningYtelseVurdering): ValuePair<string>[] {
  const begrunnelse = vurdering?.begrunnelse || 'Ingen begrunnelse på behandling funnet';
  const perioder = vurdering.vurderinger || [];

  const felter: ValuePair<string>[] = [
    {
      label: 'Begrunnelse',
      value: begrunnelse,
    },
  ];

  if (perioder.length === 0) {
    felter.push({
      label: 'Ytelse(r)',
      value: 'Ingen ytelser',
    });
  } else {
    perioder.map((item, index) => {
      const ytelseLabel = index === 0 ? 'Ytelse(r)' : '';
      const value = `${storForbokstavOgMellomromForUnderstrek(item.ytelseType)} (${formaterDatoForFrontend(item.periode.fom)}
       - ${formaterDatoForFrontend(item.periode.tom)}) - ${item.gradering}% Samordningsgrad`;

      felter.push({
        label: ytelseLabel,
        value,
      });
    });
  }

  return felter;
}

export function beregnTidligsteVirkningstidspunkt(
  samordninger: SamordnetYtelse[],
  rettighetsperiodeFom: Date
): string | undefined {
  const perioderMedFullSamordning = samordninger
    .filter((s) => s.gradering == 100 && !!s.periode.fom && !!s.periode.tom)
    .map((s) => ({
      fom: parse(s.periode.fom, 'dd.MM.yyyy', new Date()),
      tom: parse(s.periode.tom, 'dd.MM.yyyy', new Date()),
    }))
    .filter((p) => isValid(p.fom) && isValid(p.tom))
    .sort((a, b) => a.fom.getTime() - b.fom.getTime());

  if (!perioderMedFullSamordning.length) return undefined;

  // Gå gjennom periodene fra rettighetsperiodens start.
  // Første dag som ikke er dekket av en 100%-periode er tidligste virkningstidspunkt.
  let førsteDagUtenFullSamordning = rettighetsperiodeFom;
  for (const { fom, tom } of perioderMedFullSamordning) {
    const erHullFørDennePerioden = fom > førsteDagUtenFullSamordning;
    if (erHullFørDennePerioden) {
      return format(førsteDagUtenFullSamordning, 'dd.MM.yyyy');
    }
    førsteDagUtenFullSamordning = addDays(tom, 1);
  }

  // Fant ingen hull, så første dag uten full samordning er dagen etter siste periode
  return format(førsteDagUtenFullSamordning, 'dd.MM.yyyy');
}
