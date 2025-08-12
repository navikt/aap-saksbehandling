'use client';

import { Periode, SamordningGraderingGrunnlag, SamordningYtelsestype } from 'lib/types/types';
import { useLøsBehovOgGåTilNesteSteg } from 'hooks/saksbehandling/LøsBehovOgGåTilNesteStegHook';
import { Alert, BodyShort, Box, Button, Detail, HStack, VStack } from '@navikt/ds-react';
import { FormEvent, useState } from 'react';
import { useConfigForm } from 'components/form/FormHook';
import { FormField } from 'components/form/FormField';
import { useBehandlingsReferanse } from 'hooks/saksbehandling/BehandlingHook';
import { Behovstype } from 'lib/utils/form';
import { formaterDatoForBackend, formaterDatoForFrontend } from 'lib/utils/date';
import { addDays, format, isValid, parse } from 'date-fns';
import { YtelseTabell } from 'components/behandlinger/samordning/samordninggradering/YtelseTabell';
import { validerDato } from 'lib/validation/dateValidation';

import styles from 'components/behandlinger/samordning/samordninggradering/SamordningGradering.module.css';
import { InformationSquareFillIcon } from '@navikt/aksel-icons';
import { Ytelsesvurderinger } from 'components/behandlinger/samordning/samordninggradering/Ytelsesvurderinger';
import { VilkårsKortMedForm } from 'components/vilkårskort/vilkårskortmedform/VilkårsKortMedForm';
import { isNullOrUndefined } from 'lib/utils/validering';

interface Props {
  grunnlag: SamordningGraderingGrunnlag;
  behandlingVersjon: number;
  readOnly: boolean;
}

type SamordnetYtelse = {
  ytelseType: SamordningYtelsestype | undefined;
  kilde: string;
  manuell?: boolean;
  graderingFraKilde?: number;
  gradering?: number;
  kronseum?: number;
  periode: Periode;
};

export interface SamordningGraderingFormfields {
  begrunnelse: string;
  maksDatoEndelig: string;
  fristNyRevurdering?: string;
  vurderteSamordninger: SamordnetYtelse[];
}

export const SamordningGradering = ({ grunnlag, behandlingVersjon, readOnly }: Props) => {
  const [errorMessage, setErrorMessage] = useState<String | undefined>(undefined);
  const ytelserFraVurderinger: SamordnetYtelse[] = grunnlag.vurderinger.map((ytelse) => ({
    ytelseType: ytelse.ytelseType,
    kilde: '',
    graderingFraKilde: undefined,
    gradering: !isNullOrUndefined(ytelse.gradering) ? ytelse.gradering : undefined,
    manuell: ytelse.manuell || undefined,
    periode: {
      fom: format(new Date(ytelse.periode.fom), 'dd.MM.yyyy'),
      tom: format(new Date(ytelse.periode.tom), 'dd.MM.yyyy'),
    },
  }));

  const behandlingsreferanse = useBehandlingsReferanse();
  const [visForm, setVisForm] = useState<boolean>(!!(grunnlag.ytelser.length > 0 || grunnlag.vurderinger.length > 0));

  const { form, formFields } = useConfigForm<SamordningGraderingFormfields>(
    {
      begrunnelse: {
        type: 'textarea',
        label: 'Vurder utbetalingsgrad for folketrygdytelser',
        rules: { required: 'Du må gjøre en vilkårsvurdering' },
        defaultValue: grunnlag.begrunnelse || undefined,
      },
      maksDatoEndelig: {
        type: 'radio',
        label: 'Skal virkningstidspunkt revurderes nærmere?',
        options: [
          { label: 'Ja, virkningstidspunkt må vurderes på nytt', value: 'false' },
          { label: 'Nei, virkningstidspunkt er bekreftet', value: 'true' },
        ],
        rules: { required: 'Du må ta stilling til om virkningstidspunkt er endelig' },
        defaultValue:
          grunnlag.maksDatoEndelig === undefined || grunnlag.maksDatoEndelig === null
            ? undefined
            : grunnlag.maksDatoEndelig.toString(),
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
        defaultValue:
          (grunnlag.fristNyRevurdering && formaterDatoForFrontend(grunnlag.fristNyRevurdering)) || undefined,
      },
      vurderteSamordninger: {
        type: 'fieldArray',
        defaultValue: ytelserFraVurderinger,
      },
    },
    { readOnly: readOnly, shouldUnregister: true }
  );

  const { løsBehovOgGåTilNesteSteg, status, isLoading, løsBehovOgGåTilNesteStegError } =
    useLøsBehovOgGåTilNesteSteg('SAMORDNING_GRADERING');

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    form.handleSubmit(async (data) => {
      setErrorMessage(undefined);
      if (grunnlag.ytelser.length > 0 && data.vurderteSamordninger.length === 0) {
        setErrorMessage('Du må gjøre en vurdering av periodene');
      } else {
        return løsBehovOgGåTilNesteSteg({
          behandlingVersjon: behandlingVersjon,
          behov: {
            behovstype: Behovstype.AVKLAR_SAMORDNING_GRADERING,
            vurderingerForSamordning: {
              begrunnelse: data.begrunnelse,
              maksDatoEndelig: data.maksDatoEndelig !== 'false',
              fristNyRevurdering:
                data.fristNyRevurdering &&
                formaterDatoForBackend(parse(data.fristNyRevurdering, 'dd.MM.yyyy', new Date())),
              vurderteSamordningerData: data.vurderteSamordninger.map((vurdertSamordning) => ({
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
        });
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

  return (
    <VilkårsKortMedForm
      heading="§§ 11-27 / 11-28 Samordning med andre folketrygdytelser"
      steg="SAMORDNING_GRADERING"
      onSubmit={handleSubmit}
      isLoading={isLoading}
      status={status}
      visBekreftKnapp={!readOnly}
      løsBehovOgGåTilNesteStegError={løsBehovOgGåTilNesteStegError}
      vilkårTilhørerNavKontor={false}
      vurdertAvAnsatt={grunnlag.vurdertAv}
    >
      {visForm && (
        <VStack gap={'6'}>
          <FormField form={form} formField={formFields.begrunnelse} className="begrunnelse" />
          <YtelseTabell ytelser={grunnlag.ytelser} />
          <Ytelsesvurderinger form={form} readOnly={readOnly} />
          {visRevurderVirkningstidspunkt && (
            <Box maxWidth={'90ch'}>
              <Box
                padding={'4'}
                borderColor="border-info"
                borderWidth="1 1 0 1"
                borderRadius={'xlarge xlarge 0 0'}
                background="surface-info-subtle"
              >
                <HStack gap={'2'} align={'center'}>
                  <InformationSquareFillIcon title="a11y-title" fontSize="1.5rem" className={styles.infoIkon} />
                  <BodyShort size={'small'}>
                    Tidligste virkningstidspunkt etter samordning er{' '}
                    <strong>{finnTidligsteVirkningstidspunkt()}</strong>
                  </BodyShort>
                </HStack>
              </Box>
              <Box padding={'4'} borderColor="border-info" borderWidth="1" borderRadius={'0 0 xlarge xlarge'}>
                <VStack gap={'2'}>
                  <FormField form={form} formField={formFields.maksDatoEndelig} />
                  {form.watch('maksDatoEndelig') === 'false' && (
                    <FormField form={form} formField={formFields.fristNyRevurdering} />
                  )}
                </VStack>
              </Box>
            </Box>
          )}
          {errorMessage && <Alert variant={'error'}>{errorMessage}</Alert>}
        </VStack>
      )}
      {!visForm && grunnlag.ytelser.length === 0 && grunnlag.vurderinger.length === 0 && (
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
    </VilkårsKortMedForm>
  );
};
