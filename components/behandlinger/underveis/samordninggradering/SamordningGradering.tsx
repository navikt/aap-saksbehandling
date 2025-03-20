'use client';

import { VilkårsKort } from 'components/vilkårskort/VilkårsKort';
import { Periode, SamordningGraderingGrunnlag, SamordningYtelsestype } from 'lib/types/types';
import { Form } from 'components/form/Form';
import { useLøsBehovOgGåTilNesteSteg } from 'hooks/LøsBehovOgGåTilNesteStegHook';
import { Button, Detail, ExpansionCard, HStack, VStack } from '@navikt/ds-react';
import { FormEvent, useEffect, useState } from 'react';
import { useConfigForm } from 'components/form/FormHook';
import { FormField } from 'components/form/FormField';
import { useBehandlingsReferanse } from 'hooks/BehandlingHook';
import { Behovstype } from 'lib/utils/form';
import { formaterDatoForBackend } from 'lib/utils/date';
import { addDays, format, isValid, parse } from 'date-fns';
import { YtelseTabell } from 'components/behandlinger/underveis/samordninggradering/YtelseTabell';
import { validerDato } from 'lib/validation/dateValidation';

interface Props {
  grunnlag: SamordningGraderingGrunnlag;
  behandlingVersjon: number;
  readOnly: boolean;
}

type SamordnetYtelse = {
  ytelseType: SamordningYtelsestype | undefined;
  kilde: string;
  graderingFraKilde?: number;
  gradering?: number;
  kronseum?: number;
  periode: Periode;
};

export interface SamordningGraderingFormfields {
  begrunnelse: string;
  maksDatoEndelig: string;
  maksDato?: string;
  vurderteSamordninger: SamordnetYtelse[];
}

export const SamordningGradering = ({ grunnlag, behandlingVersjon, readOnly }: Props) => {
  // TODO må også håndtere vurderinger
  console.log(`SamordningGrunnlag: ${JSON.stringify(grunnlag)}`);
  const samordnedeYtelserDefaultValue: SamordnetYtelse[] = grunnlag.ytelser.map((ytelse) => ({
    ytelseType: ytelse.ytelseType,
    kilde: ytelse.kilde,
    graderingFraKilde: ytelse.gradering || undefined,
    gradering: undefined,
    periode: {
      fom: format(new Date(ytelse.periode.fom), 'dd.MM.yyyy'),
      tom: format(new Date(ytelse.periode.tom), 'dd.MM.yyyy'),
    },
  }));

  const behandlingsreferanse = useBehandlingsReferanse();
  const [visForm, setVisForm] = useState<boolean>(!!samordnedeYtelserDefaultValue.length);
  const [visRevurderVirkningstidspunkt, oppdaterVisRevurderVirkningstidspunkt] = useState<boolean>(false);

  const { form, formFields } = useConfigForm<SamordningGraderingFormfields>(
    {
      begrunnelse: {
        type: 'textarea',
        label: 'Vurder utbetalingsgrad for folketrygdytelser',
        rules: { required: 'Du må gjøre en vilkårsvurdering' },
      },
      maksDatoEndelig: {
        type: 'radio',
        label: 'Skal virkningstidspunkt revurderes nærmere?',
        options: [
          { label: 'Ja, virkningstidspunkt må vurderes på nytt', value: 'false' },
          { label: 'Nei, virkningstidspunkt er bekreftet', value: 'true' },
        ],
        rules: { required: 'Du må ta stilling til om virkningstidspunkt er endelig' },
      },
      maksDato: {
        type: 'date_input',
        label: 'Sett dato for ny revurdering',
        rules: {
          required: 'Du må sette en dato for revurdering',
          validate: {
            gyldigDato: (v) => validerDato(v as string),
          },
        },
      },
      vurderteSamordninger: {
        type: 'fieldArray',
        defaultValue: samordnedeYtelserDefaultValue || [],
      },
    },
    { readOnly }
  );

  const { løsBehovOgGåTilNesteSteg, status, isLoading, resetStatus } =
    useLøsBehovOgGåTilNesteSteg('SAMORDNING_GRADERING');

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    form.handleSubmit(async (data) =>
      løsBehovOgGåTilNesteSteg({
        behandlingVersjon: behandlingVersjon,
        behov: {
          behovstype: Behovstype.AVKLAR_SAMORDNING_GRADERING,
          vurderingerForSamordning: {
            begrunnelse: data.begrunnelse,
            maksDatoEndelig: data.maksDatoEndelig === 'true',
            maksDato: data.maksDato,
            vurderteSamordningerData: data.vurderteSamordninger.map((vurdertSamordning) => ({
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
      })
    )(event);
  };

  const samordninger = form.watch('vurderteSamordninger').map((vurdering) => vurdering.gradering);
  useEffect(() => {
    if (samordninger.some((verdi) => Number(verdi) === 100)) {
      oppdaterVisRevurderVirkningstidspunkt(true);
    } else {
      oppdaterVisRevurderVirkningstidspunkt(false);
    }
  }, [samordninger]);

  const finnTidligsteVirkningstidspunkt = () => {
    const alleTomDatoer = form
      .getValues('vurderteSamordninger')
      .filter((vurdering) => !!vurdering.periode.tom)
      .map((vurdert) => parse(vurdert.periode.tom, 'dd.MM.yyyy', new Date()))
      .filter((dato) => isValid(dato));

    if (!alleTomDatoer.length) {
      return undefined;
    }

    const senesteDato = Math.max(...alleTomDatoer.map((e) => e.getTime()));
    return format(addDays(new Date(senesteDato), 1), 'dd.MM.yyyy');
  };

  return (
    <VilkårsKort heading="§§ 11-27 / 11-28 Samordning med andre folketrygdytelser" steg="SAMORDNING_GRADERING">
      {visForm && (
        <>
          <Form
            steg={'SAMORDNING_GRADERING'}
            onSubmit={handleSubmit}
            isLoading={isLoading}
            status={status}
            visBekreftKnapp={!readOnly}
            resetStatus={resetStatus}
          >
            <FormField form={form} formField={formFields.begrunnelse} className="begrunnelse" />
            <YtelseTabell form={form} readOnly={readOnly} />
            {visRevurderVirkningstidspunkt && (
              <ExpansionCard aria-label="Tidligste virkningstidspunkt etter samordning er" open>
                <ExpansionCard.Header>
                  Tidligste virkningstidspunkt etter samordning er: {finnTidligsteVirkningstidspunkt()}
                </ExpansionCard.Header>
                <ExpansionCard.Content>
                  <FormField form={form} formField={formFields.maksDatoEndelig} />
                  {form.watch('maksDatoEndelig') === 'false' && (
                    <FormField form={form} formField={formFields.maksDato} />
                  )}
                </ExpansionCard.Content>
              </ExpansionCard>
            )}
          </Form>
        </>
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
    </VilkårsKort>
  );
};
