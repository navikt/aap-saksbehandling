'use client';

import { VilkårsKortMedForm } from 'components/vilkårskort/vilkårskortmedform/VilkårsKortMedForm';
import { useLøsBehovOgGåTilNesteSteg } from 'hooks/LøsBehovOgGåTilNesteStegHook';
import { Alert, BodyShort, HStack } from '@navikt/ds-react';
import { useConfigForm } from 'components/form/FormHook';
import { FormField } from 'components/form/FormField';
import { FormEvent } from 'react';
import { Behovstype } from 'lib/utils/form';
import { useBehandlingsReferanse } from 'hooks/BehandlingHook';
import { ManuellInntektGrunnlag } from 'lib/types/types';

interface Props {
  behandlingsversjon: number;
  grunnlag: ManuellInntektGrunnlag;
}

interface FormFields {
  begrunnelse: string;
  inntekt: string;
}

export const FastsettManuellInntekt = ({ behandlingsversjon, grunnlag }: Props) => {
  const behandlingsReferanse = useBehandlingsReferanse();
  const { løsBehovOgGåTilNesteSteg, isLoading, status, løsBehovOgGåTilNesteStegError } =
    useLøsBehovOgGåTilNesteSteg('MANGLENDE_LIGNING');

  const { form, formFields } = useConfigForm<FormFields>({
    begrunnelse: {
      type: 'textarea',
      label: 'Begrunn inntekt for siste beregningsår',
      rules: { required: 'Du må gi en begrunnelse.' },
    },
    inntekt: {
      type: 'text',
      label: 'Oppgi inntekt',
      rules: { required: 'Du må oppgi inntekt for det siste året.' },
    },
  });

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    form.handleSubmit((data) => {
      løsBehovOgGåTilNesteSteg({
        behandlingVersjon: behandlingsversjon,
        behov: {
          behovstype: Behovstype.FASTSETT_MANUELL_INNTEKT,
          manuellVurderingForManglendeInntekt: {
            begrunnelse: data.begrunnelse,
            belop: Number(data.inntekt),
          },
        },
        referanse: behandlingsReferanse,
      });
    })(event);
  }

  return (
    <VilkårsKortMedForm
      heading={'Pensjonsgivende inntekt mangler (§ 11-19)'}
      steg={'MANGLENDE_LIGNING'}
      onSubmit={handleSubmit}
      isLoading={isLoading}
      erAktivtSteg={true}
      løsBehovOgGåTilNesteStegError={løsBehovOgGåTilNesteStegError}
      status={status}
      visBekreftKnapp={true}
      vilkårTilhørerNavKontor={false}
    >
      <Alert variant={'warning'} size={'small'}>
        Du må oppgi pensjonsgivende inntekt for siste beregningsår, fordi ingen inntekt er registrert.{' '}
      </Alert>
      <FormField form={form} formField={formFields.begrunnelse} className={'begrunnelse'} />
      <HStack gap={'2'} align={'end'}>
        <FormField form={form} formField={formFields.inntekt} className={'begrunnelse'} />
        <BodyShort size={'small'}>0,00 G</BodyShort>
      </HStack>
    </VilkårsKortMedForm>
  );
};
