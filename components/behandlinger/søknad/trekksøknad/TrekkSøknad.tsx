'use client';

import { Form } from 'components/form/Form';
import { FormField } from 'components/form/FormField';
import { useConfigForm } from 'components/form/FormHook';
import { VilkårsKort } from 'components/vilkårskort/VilkårsKort';
import { useBehandlingsReferanse } from 'hooks/BehandlingHook';
import { useLøsBehovOgGåTilNesteSteg } from 'hooks/LøsBehovOgGåTilNesteStegHook';
import { TrukketSøknadGrunnlag } from 'lib/types/types';
import { Behovstype } from 'lib/utils/form';
import { FormEvent } from 'react';

interface Props {
  grunnlag: TrukketSøknadGrunnlag;
  readOnly: boolean;
  behandlingVersjon: number;
}

interface FormFields {
  begrunnelse: string;
}

export const TrekkSøknad = ({ readOnly, behandlingVersjon }: Props) => {
  const behandlingsReferanse = useBehandlingsReferanse();
  const { løsBehovOgGåTilNesteSteg, isLoading, status, resetStatus, løsBehovOgGåTilNesteStegError } =
    useLøsBehovOgGåTilNesteSteg('SØKNAD');
  const { form, formFields } = useConfigForm<FormFields>(
    {
      begrunnelse: {
        type: 'textarea',
        label: 'Begrunnelse',
        rules: { required: 'Du må begrunne hvorfor søknaden skal trekkes' },
      },
    },
    { readOnly: readOnly }
  );

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    form.handleSubmit((data) => {
      løsBehovOgGåTilNesteSteg({
        behandlingVersjon: behandlingVersjon,
        behov: {
          behovstype: Behovstype.VURDER_TREKK_AV_SØKNAD_KODE,
          begrunnelse: data.begrunnelse,
        },
        referanse: behandlingsReferanse,
      });
    })(event);
  };

  return (
    <VilkårsKort heading={'Trekk søknad'} steg={'SØKNAD'}>
      <Form
        onSubmit={handleSubmit}
        status={status}
        resetStatus={resetStatus}
        isLoading={isLoading}
        steg={'SØKNAD'}
        visBekreftKnapp={!readOnly}
        løsBehovOgGåTilNesteStegError={løsBehovOgGåTilNesteStegError}
      >
        <FormField form={form} formField={formFields.begrunnelse} className="begrunnelse" />
      </Form>
    </VilkårsKort>
  );
};
