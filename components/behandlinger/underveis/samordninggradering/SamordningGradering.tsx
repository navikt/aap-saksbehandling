'use client';

import { VilkårsKort } from 'components/vilkårskort/VilkårsKort';
import { Periode, SamordningGraderingGrunnlag, SamordningYtelsestype } from 'lib/types/types';
import { Form } from 'components/form/Form';
import { useLøsBehovOgGåTilNesteSteg } from 'hooks/LøsBehovOgGåTilNesteStegHook';
import { Button, Detail, ExpansionCard, HStack, VStack } from '@navikt/ds-react';
import { FormEvent, useState } from 'react';
import { useConfigForm } from 'components/form/FormHook';
import { FormField } from 'components/form/FormField';
import { useBehandlingsReferanse } from 'hooks/BehandlingHook';
import { Behovstype } from 'lib/utils/form';
import { formaterDatoForBackend } from 'lib/utils/date';
import { parse } from 'date-fns';
import { YtelseTabell } from 'components/behandlinger/underveis/samordninggradering/YtelseTabell';

interface Props {
  grunnlag: SamordningGraderingGrunnlag;
  behandlingVersjon: number;
  readOnly: boolean;
}

type SamordnetYtelse = {
  ytelseType: SamordningYtelsestype | undefined;
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
  const behandlingsreferanse = useBehandlingsReferanse();
  const [visForm, setVisForm] = useState<boolean>(false);
  const { form, formFields } = useConfigForm<SamordningGraderingFormfields>(
    {
      begrunnelse: {
        type: 'textarea',
        label: 'Vurder utbetalingsgrad for folketrygdytelser',
      },
      maksDatoEndelig: {
        type: 'radio',
        label: 'Skal virkningstidspunkt revurderes nærmere?',
        options: [
          { label: 'Ja, virkningstidspunkt må vurderes på nytt', value: 'false' },
          { label: 'Nei, virkningstidspunkt er bekreftet', value: 'true' },
        ],
      },
      maksDato: {
        type: 'date_input',
        label: 'Sett dato for ny revurdering',
      },
      vurderteSamordninger: {
        type: 'fieldArray',
        defaultValue: [],
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

  return (
    <VilkårsKort heading="§§ 11-27 / 11-28 Samordning med andre folketrygdytelser" steg="SAMORDNING_GRADERING">
      {visForm && (
        <>
          <Form
            steg={'SAMORDNING_GRADERING'}
            onSubmit={handleSubmit}
            isLoading={isLoading}
            status={status}
            resetStatus={resetStatus}
          >
            <FormField form={form} formField={formFields.begrunnelse} />
            <YtelseTabell form={form} readOnly={readOnly} />
            <ExpansionCard aria-label="Tidligste virkningstidspunkt etter samordning er" open>
              <ExpansionCard.Header>Tidligste virkningstidspunkt etter samordning er</ExpansionCard.Header>
              <ExpansionCard.Content>
                <FormField form={form} formField={formFields.maksDatoEndelig} />
                {form.watch('maksDatoEndelig') === 'false' && <FormField form={form} formField={formFields.maksDato} />}
              </ExpansionCard.Content>
            </ExpansionCard>
          </Form>
        </>
      )}
      {!visForm && grunnlag.ytelser.length === 0 && grunnlag.vurderinger.length === 0 && (
        <VStack gap={'2'}>
          <Detail>Vi finner ingen ytelser fra folketrygden</Detail>
          <HStack>
            <Button size={'small'} type={'button'} variant={'secondary'} onClick={() => setVisForm(true)}>
              Legg til folketrygdytelse
            </Button>
          </HStack>
        </VStack>
      )}
    </VilkårsKort>
  );
};
