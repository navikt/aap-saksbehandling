'use client';

import { FormField } from 'components/form/FormField';
import { useConfigForm } from 'components/form/FormHook';
import { useBehandlingsReferanse } from 'hooks/BehandlingHook';
import { useLøsBehovOgGåTilNesteSteg } from 'hooks/LøsBehovOgGåTilNesteStegHook';
import { TrukketSøknadGrunnlag } from 'lib/types/types';
import { Behovstype } from 'lib/utils/form';
import { FormEvent } from 'react';
import { VilkårsKortMedForm } from 'components/vilkårskort/vilkårskortmedform/VilkårsKortMedForm';

interface Props {
  grunnlag: TrukketSøknadGrunnlag;
  readOnly: boolean;
  behandlingVersjon: number;
}

interface FormFields {
  begrunnelse: string;
}

export const TrekkSøknad = ({ grunnlag, readOnly, behandlingVersjon }: Props) => {
  const behandlingsReferanse = useBehandlingsReferanse();
  const { løsBehovOgGåTilNesteSteg, isLoading, status, løsBehovOgGåTilNesteStegError } =
      useLøsBehovOgGåTilNesteSteg('SØKNAD');
  const vurderingerString = grunnlag?.vurderinger
      ?.map(
          (vurdering) => `${vurdering.begrunnelse}`
      )
      .join(', ') || '';
  const { form, formFields } = useConfigForm<FormFields>(
      {
        begrunnelse: {
          type: 'textarea',
          label: 'Begrunnelse',
          defaultValue: vurderingerString,
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
      <VilkårsKortMedForm
        heading={'Trekk søknad'}
        steg={'SØKNAD'}
        onSubmit={handleSubmit}
        status={status}
        isLoading={isLoading}
        visBekreftKnapp={!readOnly}
        løsBehovOgGåTilNesteStegError={løsBehovOgGåTilNesteStegError}
        erAktivtSteg={true}
        vilkårTilhørerNavKontor={false}
      >
        <FormField form={form} formField={formFields.begrunnelse} className="begrunnelse" />
      </VilkårsKortMedForm>
  );
};
