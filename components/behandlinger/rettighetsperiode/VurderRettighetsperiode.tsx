'use client';

import { useBehandlingsReferanse } from 'hooks/BehandlingHook';
import { useLøsBehovOgGåTilNesteSteg } from 'hooks/LøsBehovOgGåTilNesteStegHook';
import { useConfigForm } from 'components/form/FormHook';
import { FormField } from 'components/form/FormField';
import { FormEvent } from 'react';
import { Behovstype } from 'lib/utils/form';
import { VilkårsKort } from 'components/vilkårskort/VilkårsKort';
import { Form } from 'components/form/Form';

interface Props {
  readOnly: boolean;
  behandlingVersjon: number;
  grunnlag: any;
}

interface FormFields {
  begrunnelse: string;
  startDato: string;
}

export const VurderRettighetsperiode = ({ grunnlag, readOnly, behandlingVersjon }: Props) => {
  console.log(grunnlag);
  const behandlingsReferanse = useBehandlingsReferanse();
  const { løsBehovOgGåTilNesteSteg, isLoading, status, resetStatus, løsBehovOgGåTilNesteStegError } =
    useLøsBehovOgGåTilNesteSteg('VURDER_RETTIGHETSPERIODE');
  const { form, formFields } = useConfigForm<FormFields>(
    {
      begrunnelse: {
        type: 'textarea',
        label: 'Begrunnelse',
        rules: { required: 'Du må begrunne hvorfor virkningstidspunktet skal endres' },
      },
      startDato: {
        type: 'date',
        label: 'Ny startdato',
        rules: { required: 'Må fylles inn' },
      },
    },
    { readOnly: readOnly }
  );

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    form.handleSubmit((data) => {
      løsBehovOgGåTilNesteSteg({
        behandlingVersjon: behandlingVersjon,
        behov: {
          behovstype: Behovstype.VURDER_RETTIGHETSPERIODE,
          rettighetsperiodeVurdering: {
            begrunnelse: data.begrunnelse,
            startDato: data.startDato,
          },
        },
        referanse: behandlingsReferanse,
      });
    })(event);
  };

  return (
    <VilkårsKort heading={'Virkningstidspunkt'} steg={'VURDER_RETTIGHETSPERIODE'}>
      <Form
        onSubmit={handleSubmit}
        status={status}
        resetStatus={resetStatus}
        isLoading={isLoading}
        steg={'VURDER_RETTIGHETSPERIODE'}
        visBekreftKnapp={!readOnly}
        løsBehovOgGåTilNesteStegError={løsBehovOgGåTilNesteStegError}
      >
        <FormField form={form} formField={formFields.begrunnelse} />
        <FormField form={form} formField={formFields.startDato} />
      </Form>
    </VilkårsKort>
  );
};
