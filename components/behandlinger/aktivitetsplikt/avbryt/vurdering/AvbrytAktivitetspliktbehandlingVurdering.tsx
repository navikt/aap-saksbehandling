'use client';

import { AvbrytAktivitetspliktbehandlingGrunnlag } from 'lib/types/types';
import { useParamsMedType } from 'hooks/saksbehandling/BehandlingHook';
import { useLøsBehovOgGåTilNesteSteg } from 'hooks/saksbehandling/LøsBehovOgGåTilNesteStegHook';
import { useVilkårskortVisning } from 'hooks/saksbehandling/visning/VisningHook';
import { useConfigForm } from 'components/form/FormHook';
import { FormEvent } from 'react';
import { Behovstype } from 'lib/utils/form';
import { VilkårskortMedForm } from 'components/vilkårskort/vilkårskortmedform/VilkårskortMedForm';
import { FormField } from 'components/form/FormField';

interface Props {
  behandlingVersjon: number;
  readOnly: boolean;
  grunnlag: AvbrytAktivitetspliktbehandlingGrunnlag;
}

interface FormFields {
  aarsak?: 'BEHANDLINGEN_BLE_OPPRETTET_VED_EN_FEIL' | 'DET_HAR_OPPSTAATT_EN_FEIL_OG_BEHANDLINGEN_MAA_STARTES_PAA_NYTT';
  begrunnelse: string;
}

export const AvbrytAktivitetspliktbehandlingVurdering = ({ grunnlag, readOnly, behandlingVersjon }: Props) => {
  const { behandlingsreferanse } = useParamsMedType();
  const { løsBehovOgGåTilNesteSteg, isLoading, status, løsBehovOgGåTilNesteStegError } = useLøsBehovOgGåTilNesteSteg(
    'AVBRYT_AKTIVITETSPLIKTBEHANDLING'
  );

  const { visningModus, visningActions, formReadOnly } = useVilkårskortVisning(
    readOnly,
    'AVBRYT_AKTIVITETSPLIKTBEHANDLING',
    undefined
  );

  const { form, formFields } = useConfigForm<FormFields>(
    {
      aarsak: {
        type: 'combobox',
        label: 'Hva er årsaken til at behandlingen skal avbrytes?',
        options: [
          { value: 'BEHANDLINGEN_BLE_OPPRETTET_VED_EN_FEIL', label: 'Behandlingen ble opprettet ved en feil' },
          {
            value: 'DET_HAR_OPPSTAATT_EN_FEIL_OG_BEHANDLINGEN_MAA_STARTES_PAA_NYTT',
            label: 'Det har oppstått en feil og behandlingen må startes på nytt',
          },
        ],
        defaultValue: grunnlag?.vurdering?.årsak ?? undefined,
        rules: {
          required: 'Velg en årsak for å avbryte behandlingen',
        },
      },
      begrunnelse: {
        type: 'textarea',
        label: 'Begrunnelse (obligatorisk)',
        description: 'Utdyp hvorfor behandlingen avbrytes',
        defaultValue: grunnlag?.vurdering?.begrunnelse,
        rules: { required: 'Du må begrunne hvorfor behandlingen avbrytes' },
      },
    },
    { readOnly: formReadOnly }
  );

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    form.handleSubmit((data) => {
      løsBehovOgGåTilNesteSteg({
        behandlingVersjon: behandlingVersjon,
        behov: {
          behovstype: Behovstype.AVBRYT_AKTIVITETSPLIKTBEHANDLING,
          vurdering: {
            begrunnelse: data.begrunnelse,
            årsak: data.aarsak,
          },
        },
        referanse: behandlingsreferanse,
      });
    })(event);
  };

  return (
    <VilkårskortMedForm
      heading={'Avbryt behandling'}
      steg={'AVBRYT_AKTIVITETSPLIKTBEHANDLING'}
      onSubmit={handleSubmit}
      status={status}
      isLoading={isLoading}
      løsBehovOgGåTilNesteStegError={løsBehovOgGåTilNesteStegError}
      vilkårTilhørerNavKontor={true}
      visningModus={visningModus}
      visningActions={visningActions}
      formReset={() => form.reset()}
      vurdertAvAnsatt={grunnlag?.vurdering?.vurderingerMeta.vurdertAv}
    >
      <FormField form={form} formField={formFields.aarsak} className="årsak" />
      <FormField form={form} formField={formFields.begrunnelse} className="begrunnelse" />
    </VilkårskortMedForm>
  );
};
