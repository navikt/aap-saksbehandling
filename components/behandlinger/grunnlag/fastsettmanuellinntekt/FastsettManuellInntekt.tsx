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
  readOnly: boolean;
}

interface FormFields {
  begrunnelse: string;
  inntekt: string;
}

export const FastsettManuellInntekt = ({ behandlingsversjon, grunnlag, readOnly }: Props) => {
  const behandlingsReferanse = useBehandlingsReferanse();
  const { løsBehovOgGåTilNesteSteg, isLoading, status, løsBehovOgGåTilNesteStegError } =
    useLøsBehovOgGåTilNesteSteg('MANGLENDE_LIGNING');

  const { form, formFields } = useConfigForm<FormFields>(
    {
      begrunnelse: {
        type: 'textarea',
        label: `Begrunn inntekt for siste beregningsår (${grunnlag.ar})`,
        rules: { required: 'Du må gi en begrunnelse.' },
        defaultValue: grunnlag.vurdering?.begrunnelse,
      },
      inntekt: {
        type: 'number',
        label: 'Oppgi inntekt',
        rules: {
          required: 'Du må oppgi inntekt for det siste året.',
          min: { value: 0, message: 'Inntekt kan ikke være negativ.' },
        },
        defaultValue: grunnlag.vurdering?.belop.toString() || '',
      },
    },
    { readOnly }
  );

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

  const inntektStr = form.watch('inntekt');
  const inntekt = inntektStr && inntektStr !== '' ? Number(inntektStr) : 0;
  const inntektIgVerdi = grunnlag.gverdi ? inntekt / grunnlag.gverdi : 0;

  return (
    <VilkårsKortMedForm
      heading={'Pensjonsgivende inntekt mangler (§ 11-19)'}
      steg={'MANGLENDE_LIGNING'}
      onSubmit={handleSubmit}
      isLoading={isLoading}
      erAktivtSteg={true}
      løsBehovOgGåTilNesteStegError={løsBehovOgGåTilNesteStegError}
      status={status}
      visBekreftKnapp={!readOnly}
      vilkårTilhørerNavKontor={false}
      vurdertAvAnsatt={grunnlag.vurdering?.vurdertAv}
    >
      <Alert variant={'warning'} size={'small'}>
        Du må oppgi pensjonsgivende inntekt for siste beregningsår, fordi ingen inntekt er registrert. Om bruker ikke
        har hatt inntekt for gitt år, legg inn 0.{' '}
      </Alert>
      <FormField form={form} formField={formFields.begrunnelse} className={'begrunnelse'} />
      <HStack gap={'2'} align={'end'}>
        <FormField form={form} formField={formFields.inntekt} className={'inntekt_input'} />
        <BodyShort>{inntektIgVerdi.toFixed(2)} G</BodyShort>
      </HStack>
    </VilkårsKortMedForm>
  );
};
