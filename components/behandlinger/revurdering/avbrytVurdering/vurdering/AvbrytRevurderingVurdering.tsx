'use client';

import { FormField } from 'components/form/FormField';
import { useConfigForm } from 'components/form/FormHook';
import { useBehandlingsReferanse } from 'hooks/saksbehandling/BehandlingHook';
import { useLøsBehovOgGåTilNesteSteg } from 'hooks/saksbehandling/LøsBehovOgGåTilNesteStegHook';
import { Behovstype } from 'lib/utils/form';
import { FormEvent } from 'react';
import { VilkårskortMedForm } from 'components/vilkårskort/vilkårskortmedform/VilkårskortMedForm';
import { AvbrytRevurderingGrunnlag } from 'lib/types/types';

interface Props {
  behandlingVersjon: number;
  readOnly: boolean;
  grunnlag: AvbrytRevurderingGrunnlag;
}

interface FormFields {
  aarsak?:
    | 'REVURDERINGEN_BLE_OPPRETTET_VED_EN_FEIL'
    | 'DET_HAR_OPPSTAATT_EN_FEIL_OG_BEHANDLINGEN_MAA_STARTES_PAA_NYTT';
  begrunnelse: string;
}

export const AvbrytRevurderingVurdering = ({ grunnlag, readOnly, behandlingVersjon }: Props) => {
  const behandlingsReferanse = useBehandlingsReferanse();
  const { løsBehovOgGåTilNesteSteg, isLoading, status, løsBehovOgGåTilNesteStegError } =
    useLøsBehovOgGåTilNesteSteg('AVBRYT_REVURDERING');

  const { form, formFields } = useConfigForm<FormFields>(
    {
      aarsak: {
        type: 'combobox',
        label: 'Hva er årsaken til at revurderingsbehandlingen skal avbrytes?',
        options: [
          { value: 'REVURDERINGEN_BLE_OPPRETTET_VED_EN_FEIL', label: 'Revurderingen ble opprettet ved en feil' },
          { value: 'DET_HAR_OPPSTAATT_EN_FEIL_OG_BEHANDLINGEN_MAA_STARTES_PAA_NYTT', label: 'Det har oppstått en feil og behandlingen må startes på nytt' },
        ],
        defaultValue: grunnlag?.vurdering?.årsak ?? undefined,
        rules: {
          required: 'Velg en årsak for å avbryte revurderingen',
        },
      },
      begrunnelse: {
        type: 'textarea',
        label: 'Begrunnelse (obligatorisk)',
        description: 'Utdyp hvorfor revurderingen avbrytes',
        defaultValue: grunnlag?.vurdering?.begrunnelse,
        rules: { required: 'Du må begrunne hvorfor revurdering avbrytes' },
      },
    },
    { readOnly: readOnly }
  );

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    form.handleSubmit((data) => {
      løsBehovOgGåTilNesteSteg({
        behandlingVersjon: behandlingVersjon,
        behov: {
          behovstype: Behovstype.AVBRYT_REVURDERING_KODE,
          vurdering: {
            begrunnelse: data.begrunnelse,
            årsak: data.aarsak,
          },
        },
        referanse: behandlingsReferanse,
      });
    })(event);
  };

  return (
    <VilkårskortMedForm
      heading={'Avbryt revurdering'}
      steg={'AVBRYT_REVURDERING'}
      onSubmit={handleSubmit}
      status={status}
      isLoading={isLoading}
      visBekreftKnapp={!readOnly}
      løsBehovOgGåTilNesteStegError={løsBehovOgGåTilNesteStegError}
      vilkårTilhørerNavKontor={false}
    >
      <FormField form={form} formField={formFields.aarsak} className="årsak" />
      <FormField form={form} formField={formFields.begrunnelse} className="begrunnelse" />
    </VilkårskortMedForm>
  );
};
